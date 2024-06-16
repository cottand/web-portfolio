_16/06/2024 - #cockroachdb #raft #quorum #disasterrecovery #backups #no,really,backups_

Disclaimer: I do not really know what I am talking about, I am just glad I got
out of the terrible state of affairs I found myself in.

I lost quorum on my single-region CockroachDB cluster.
I found little to no documentation on what to do in this scenario,
but I managed to recover.
This post is about how I got there and what I did to fix it.

## How I got there

My cluster consists of 3 nodes, one per machine and
each with a single store, in a flat network. I set it up recently, so I was "planning to
do backups soon™" (a lie I told myself). Even if all nodes shut down, or even
if one dies permanently, CockroachDB black magic ensures I can start the nodes again
just fine - so I felt in relative safety (relative to running a single PostgreSQL node for example).


| Node | IP       | State |
|------|----------|-------|
| n1   | 10.0.0.1 | alive |
| n2   | 10.0.0.2 | alive |
| n3   | 10.0.0.3 | alive |

Then I decided to rotate my nodes (ie, wipe and redeploy them). In principle, all good:
when CockroachDB sees a new node, it replicates the stuff that would have been in the
decommissioned one.

Here comes my first mistake: when I rotated the first machine (at 10.0.0.1 in this example),
I did not `cockroach node decommission` the node before wiping it.
After the redeploy, my cluster looked like:

| Node | IP       | State       |
|------|----------|-------------|
| n1   | 10.0.0.1 | dead        |
| n2   | 10.0.0.2 | alive       |
| n3   | 10.0.0.3 | alive       |
| n4   | 10.0.0.1 | alive (new) |

This seemed fine: everything was still 3-way replicated. First node, done ✅! Let's
rotate the 2nd one (10.10.0.2). After the redeploying, now CockroachDB said:

```
* WARNING: The server appears to be unable to contact the other nodes in the cluster. Please try
*
* - starting the other nodes, if you haven't already
* - double-checking that the '--join' and '--host' flags are set up correctly
* - not using the '--background' flag.
```

Hmmm weird. I could swear the networking had not changed.

After combing the `INFO` logs, I arrived at the conclusion that my cluster must then look
like this (which is a guess, because I could not start it):

| Node | IP       | State             |
|------|----------|-------------------|
| n1   | 10.0.0.1 | dead              |
| n2   | 10.0.0.2 | dead              |
| n3   | 10.0.0.3 | alive?            |
| n4   | 10.0.0.1 | alive?            |
| n4   | 10.0.0.1 | new clueless node |



If you've ever maintained any Raft or Paxos based cluster, you know what this means:
I lost quorum! I had 2/4 healthy nodes (I cannot count the new one, because you need
quorum for a new node to join a cluster). I actually had 2/3 healthy machines,
but on paper I had killed 2 nodes on what now was 4-node cluster.

And I had no backups. 

So I decided to take a break right about... here.

## Disaster recovery


This is not the first time I have lost Raft quorum: almost all Hashicorp
products come with Raft included, so I have messed up Nomad for example.
What I needed now is to tell the nodes who was alive and who wasn't, while offline.
Nomad has [pretty good documentation](https://developer.hashicorp.com/nomad/tutorials/manage-clusters/outage-recovery#manual-recovery-using-peers-json)
on how to do this, but **I could not find anything similar for CockroachDB**.

The best I found was [this page](https://www.cockroachlabs.com/docs/stable/disaster-recovery-planning#single-region-recovery)
which says, helpfully: _"If you can’t recover 2 of the 3 failed nodes, contact Cockroach Labs support (...)"_

But it's a Saturday morning, and this is my home-lab, so I don't think I am going to
get help anytime soon.

After digging around the internet for a while, I found [this CockroachDB issue: _`cli: add debug recover commands for loss of quorum recovery`_](https://github.com/cockroachdb/cockroach/issues/71860).
Exactly what I needed! But this command [was not documented](https://www.cockroachlabs.com/docs/v24.1/cockroach-commands) in the official docs.

> Before you read on, here is my advice: even if your cluster is already broken, **back it up**. It's as simple as a `cp -r roach.d/ roach.d.bk`.

Turns out `cockroach debug recover` has exactly what I needed. It consists of 3 commands:
-  `collect-info`: you run it on every surviving node to gather info about what parts
of your data survived our incompetence
- `make-plan`: using the data you just collected, you run it once to draft
a plan to patch each of the surviving nodes' stores
- `apply-plan`: you run it on every surviving node

Assuming the store is in a folder like `/roach.d`, here are the exact commands I ran:
```bash
# on each node
cockroach debug recover collect-info --store /roach.d >> collected.n1.json

# once
cockroach debug recover make-plan collected.n1.json collected.n2.json -o plan.json

# on each node (as needed)
cockroach debug recover apply-plan --store /roach.d plan.json
```

This procedure recovered my cluster successfully 🎉

I really think it was not going to make it. My understanding is this method does **not**
guarantee the ACID data consistency I had before I lost quorum, but at this point
I do not care. I will take a corrupt row over losing the entire database (and so far,
I have found no issues!)

## The lesson

Just backup your data, so you don't need to waste an afternoon
combing the internet for an obscure blog post like this one!

When renewing nodes, make sure you also decommission them before shutting them down.

If, like me, you fail at all that, then know that the `cockroach` CLI has a very handy
recovery toolkit, even if they do not publicise it (my guess is it is dangerous enough 
to use that they want you to use it with support).