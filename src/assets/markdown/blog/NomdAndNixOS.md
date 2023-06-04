# Using NixOS to swiftly and reproducibly get Nomad clients up and running

_21/05/2023 - #noamd #nixos #cni #selfhosted_
<br></br>

## Background

Skip this bit if you don't care to know _why_ I would use NixOS to run Nomad clients!

### The problem

I run my selfhosted services on Nomad, which means that when I want to add a new machine to my fleet (say, some old
laptop lying around)
I need to install Linux on it, configure that (including my personal VPN), and set up a Nomad client.
The problems I quickly noticed were the following:

**OS/distro config is not declarative** (ie, as a file I can commit to git). Instead, it tends to involve a series of
bash commands and disseminated config files (both of which are hard to undo and must be copy-pasted somewhere in case I
need to set something up again).
In my case this included:

- Hardware config (networking, power management settings, install drivers and kernel modules...)
- Installing and configuring [Wireguard](https://wireguard.com), my personal VPN
- Installing and configuring Nomad

**It is very hard to keep track of your config when it is not declarative**. Did I enable IPv4 forwarding on this box?
What steps did I follow to install that old wireless driver for the old Mac Mini? All of these questions are easier to
deal with if I keep notes of what I do on my machines, but then I have to make sure these are up-to-date.
It would much more intuitive to specify all of this as code - this would guarantee that 'what I wrote' and 'what
happened' were the same, and I would be able to commit this code to git in order to go back in time if something catches
fire.

**It is a pain to be SSH'ing into stuff**, but you have to if you are using CLI commands to sysadmin.

### The solutions

Sounds like what we need is **declarative configuration for the OS** (in my case Linux) as code that I can **remotely
deploy** to machines in one command.
These are the main solutions I found:

- [SaltStack](https://docs.saltproject.io/en/getstarted/)
- [Ansible](https://www.ansible.com/)
- [NixOS](https://nixos.org/)

I won't go into detail on why I chose NixOS over the alternatives - ultimately it depends on what you aim to achieve and
I am sure
you can find [good discussions](https://discourse.nixos.org/t/nixos-vs-ansible/16757/2) on the tradeoffs of each one
online.

### Deploying NixOS remotely

I use [Morph](https://github.com/DBCDK/morph), but you can also use [NixOps](https://github.com/NixOS/nixops).

This will allow you to specify your NixOS config and then push it (via SSH) to the remote host.

# Nomad on NixOS

The main reason for this blog post - which is nothing too bleeding edge - is that while there is lots of documentation
on running Nomad, I could find very little on running it on top of NixOS (which is configured very differently than in other
distros).

There are plenty of guides out there about how to install and use NixOS - so I will keep to the Nomad-specific bits.

### Enabling nomad and CNI

Add the following to your NixOS config:

```nix
# file: /etc/nixos/configuration.nix #
services.nomad = {
    enable = true;
    # defaults to true, note that docker
    # group membership is effectively equivalent to being root, see https://github.com/moby/moby/issues/9976.
    enableDocker = true;
    # defaults to true - needs to be false if you want to run a server
    dropPrivileges = true;
    # cni-plugins required for bridge networking
    extraPackages = with pkgs; [ cni-plugins ];
    # defaults to empty, you can add extra nomad drivers here
    extraSettingsPlugins = [ pkgs.nomad-driver-podman ];
    # this variable allows specifying Nomad's settings in JSON structure
    settings = {
      client = {
        # required for bridge networking
        cni_path = "${pkgs.cni-plugins}/bin";
      };
    };
  };
```

The tricky part here are `cni-plugins` - these are specified in [Nomad's docs](https://developer.hashicorp.com/nomad/docs/install#post-installation-steps)
and are required for container networking (which is in turn a requirement for Consul Connect). The only gotcha is that
we must tell Nomad where NixOS installs these binaries, as it looks in `/opt/cni/bin` [by default](https://developer.hashicorp.com/nomad/docs/v1.5.x/configuration/client),
and that is not where NixOS puts them.

### Specifying Nomad agent settings in HCL

Now you _could_ SSH into your remote host and drop your preferred Nomad config there, but it is much better to tell NixOS
about it and include it in our machine's definition; and then to just deploy said definition. There are two ways you can do this
1. Through the `services.nomad.settings` variable, as I show in my example above
2. By including HCL files as part of our spec

The former is probably best for simple configurations, but for Nomad agents that have complex configs (as might be the
case if you run one for personal use) you might prefer writing your config in the supported HCL format.

```
local-dev/
├─ client.hcl
├─ server.hcl
├─ deployment.nix
```

That's easy to achieve in Nix:
```nix
# file: deployment.nix #

# Specify new files in /etc
environment.etc = {
  "nomad/config/client.hcl" = {
    text = (builtins.readFile ./client.hcl);
  };
  "nomad/config/server.hcl" = {
    text = (builtins.readFile ./server.hcl);
  };
};

# Tell nomad about them
services.nomad.extraSettingsPaths = [
      "/etc/nomad/config/server.hcl"
      "/etc/nomad/config/client.hcl"
];
```

Where to put these files exactly, or how to split them up, is up to you. But if you are using 
[Morph](https://github.com/DBCDK/morph) to deploy to your remote Nomad host, this will allow you to write in HCL
_in your local machine_ the config _of the remote machine_, and tell NixOS thanks to `builtins.readFile`, which
is a function evaluated on your local environment. 

### End result

You can also create a [NixOS module](https://nixos.wiki/wiki/NixOS_modules) that specifies all your Nomad config if 
you would prefer to split things up:
```
local-dev/
├─ deployment.nix
├─ nomad/
│  ├─ nomad.nix
│  ├─ client.hcl
│  ├─ server.hcl
```

This will be useful once your Nomad and NixOS definitions start getting big.
```nix
# file: deployment.nix #
imports = [
  ./hardware-configuration.nix
  ./nomad/nomad.nix
  # add whatever other config
];
```

The final Nomad config, for a Nomad agent acting as a Server and a Client (don't do that at work, but in your local 
Raspberry Pi it's probably fine).
```nix
# file: nomad/nomad.nix #
{ config, pkgs, ... }:
{
  environment.etc = {
    "nomad/config/client.hcl" = {
      text = (builtins.readFile ./client.hcl);
    };
    "nomad/config/server.hcl" = {
      text = (builtins.readFile ./server.hcl);
    };
  };
  services.nomad = {
    enable = true;
    enableDocker = true;
    dropPrivileges = false;
    extraPackages = with pkgs; [ cni-plugins getent ];
    extraSettingsPlugins = [ pkgs.nomad-driver-podman ];
    extraSettingsPaths = [
      "/etc/nomad/config/server.hcl"
      "/etc/nomad/config/client.hcl"
    ];
    settings = {
      client = {
        cni_path = "${pkgs.cni-plugins}/bin";
      };
    };
  };
}

```
# Conclusion

Both Nomad and NixOS have a lot of knobs to tweak, and they are not all easy to find. But once you
have determined a suitable specification it is very easy to deploy it to 1 or to 10 machines thanks to a combo of
1. NixOS declarative configs
2. Being able to define an orchestrator like Nomad in this specification
3. Remote deployments

<img src="assets/blog/nomad-nix.png" style="width: min(95%, 500px)"
caption="Nomad client page, showing NixOS as the underlying distro"
/>

# References

- [Nomad `nixpkgs` definition](https://github.com/NixOS/nixpkgs/blob/22.11/nixos/modules/services/networking/nomad.nix) - always great to refer to the source
- [Morph](https://github.com/DBCDK/morph) - nicely abstracts away redundant config between remote hosts
- [NixOS Modules](https://nixos.wiki/wiki/NixOS_modules) - a way to modularise your distro config

