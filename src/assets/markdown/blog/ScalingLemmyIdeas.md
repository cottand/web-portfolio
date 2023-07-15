# Thoughts on Scaling Lemmy

_21/05/2023 - #lemmy #scaling #noamd #selfhosted_
<br></br>

## Problem

[Lemmy](https://github.com/LemmyNet/lemmy) is a federated link aggregator (it is to Reddit what Mastodon is to Twitter)
that I recently decided to start self-hosting. Although I plan to handle very little load (I plan to be the single user of my instance)
I have seen a lot of the discussion about troubles scaling the bigger instances like [lemmy.world](https://lemmy.world/)
and [Beehaw](https://beehaw.org).

In case you want to take a peek:
- [_Lemmy resembles the old reddit experience so well that they even emulate the old reddit server performance_](https://lemmy.world/post/954358)
- [_Lemmy.world updated to 0.18.1-rc_](https://lemmy.world/post/920294)
 
Disregard issues and bugs the federation protocol or Lemmy's implementation might have for a moment. I am sure that most of
those will get ironed out as popularity, and then contributions, grow. 

A fundamental problem that can only get kicked down the road is scalability. 
**There is only so much traffic a single server will be able to handle**. 
lemmy.world is struggling right now
(with XXX users at the time of writing). The limit on the number of people it can accommodate can grow, but
never disappear, because Lemmy is currently a singleton.
The only deployments supported are only Docker and Ansible, both of which are limited to a single machine.

## Ideal solution

_Ideally_, a single Lemmy instance should be able to run on several machines at a time!
The benefits would include:
- **Scalability**: if an instance needs to accommodate for twice as many users, its admin can just double
the number of machines it runs on. This is in general much easier than buying a new machine twice as powerful.
If you assume no bottlenecks (for the sake of the argument) you can grow your instance
forever as long as you are able to add new machines to the cluster. This is simply not possible when running a single
machine because there is a limit to how powerful that machine can be.
- **Failure tolerance and therefore higher availability**: 
  - if a machine crashes, that's fine. We've got more
  - if a machine needs maintenance, taking it down won't take the entire instance down.
- **Saving $$$**: depending on your cloud provider, it's usually cheaper to run several lower-end machines
than a single high-end machine. 
  - self-hosters (like myself) are more likely to have several old machines available than
to be ready to invest in a single pricier one.
  - being cost-effective works for the community too: Lemmy relies on donations, so the more we save on paying big fat cloud
providers the more we can spend paying independent developers that bring us new features and improve Lemmy
for everyone.


I will go through Lemmy's architecture a bit and try and see what needs to happen to change this!

## Detective work

Here is a rough diagram of Lemmy's architecture at the time of writing:

TODO IMAGE CURRENT

### Orchestrating and spreading the containers

There is already the possibility here of splitting these services into separate machines.
There is benefit in this:
we can utilise existing lower-end machines to free up space in our most powerful machine,
so that hungry services have more resources available.

If you are planning to scale up, this would be a good step 0 as you will already have to set up
orchestration to run these containers across machines, which is a big shift from docker-compose/ansible.
I will not cover how to do this here, but some of your options include:
- Nomad
- k8s and its distributions
- NixOS
- Docker compose running on several machines

Each of these has different tradeoffs in how hard they are to set up vs how they are managed
and they capabilities, and the choice is yours.

Separately, you will also have to worry about networking between machines. This will heavily depend on
where these are (GCP, AWS, your living room, your toilet, Azure...) so I will also not cover that.

### Scaling the Frontend

_Stateless_ components are the easiest to scale: we can make a request to any instance of this component,
and because they are all identical, they will all behave the same, so they do not 'care' that there is more than one.

_Stateful_ components expect to be only ones 'doing' or 'knowing' something. In Lemmy, all the stateful components
are also _singletons_. Being a singleton means we cannot
run more than one copy of it, because it expects to receive all requests. 
For example, if you upload
a cat picture to pict-rs, and later ask to download it, you need to hit the same instance or you will fail
to find your cat pic. So we can't be running two copies of pict-rs!

Thankfully, some of Lemmy's components are already stateless, like Nginx and the web fronted.
This means the following architecture is already viable, without any real code changes:

TODO IMAGE SCALES FE

This has the benefits gained so far plus high availability for frontends - so
we can update them one by one, without interrupting traffic.

### Scaling the backend

This is usually the tricky part! Lemmy has 3 stateful components:
- Lemmy itself
- pict-rs
- postgres DB

Let's start with Lemmy: 



### Scaling the DB