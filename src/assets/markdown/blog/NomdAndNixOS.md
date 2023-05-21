# Using NixOS to swiftly and reproducibly get Nomad clients up and running
_21/05/2023 - #noamd #nixos #orchestration_ 
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
What steps did I follow to install that old wireless driver for the old Mac Minis? All of these questions are easier to
deal with if I keep notes of what I do in my machines, but then I have to make sure these are up-to-date.
It would much more intuitive to specify all of this as code - this would guarantee that 'what I wrote' and 'what
happened' were the same, and I would be able to commit this code to git in order to go back in time if stuff catches
fire.

**It is a pain to be SSH'ing into stuff**, but you have to if you are using CLI commands to sysadmin.

### The solutions

Sounds like what we need is **declarative configuration for the OS** (in my case Linux) as code that I can **remotely deploy** to machines in one command.
These are the main solutions I found:
- Vagrant
- [SaltStack](https://docs.saltproject.io/en/getstarted/)
- Ansible
- NixOS

I won't go into detail on why I chose NixOS over the alternatives - I am sure
you can find [good discussions](https://discourse.nixos.org/t/nixos-vs-ansible/16757/2) on the tradeoffs of each one
online.

# Nomad on NixOS

The main reason for this blog post - which is nothing too bleeding edge - is while there is lots of documentation
on running Nomad, there is very little on running it on top of NixOS (which is configured very differently than in
distros).

I recently started using [NixOS](https://nixos.org/) to set up [Nomad](https://www.nomadproject.io/) on my personal machines. Here is why:
- I try to have machines be as 'dumb' as possible, and define as much of my workloads in Nomad's job files.
  - My reasoning is that as soon as you leave containers, settings can get pretty machine-specific very quickly depending on hardware.