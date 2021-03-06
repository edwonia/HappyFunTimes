Making It Simple For Players To Get Started
===========================================

Asking players to connect to a local network and then type in some obscure URL like
`http://169.234.174.30:8080` is arguably too many steps.

One solution. Use a QR code. Unfortunately iOS doesn't have a built in reader.

Another solution. Use a URL shortener. Not sure if `http://goo.gl/D3BfG4` is better or
worse than `http://169.234.174.30:8080`

I've come up with 2 solutions so far.

Solution #1: Use happyfuntimes.net
==================================

The easiest is check the ip address of the machine you're going to run the games
and server on. To do this, just [run the server](../README.md#running-the-examples),
it should tell you the ip-address when it starts up. If that address starts with
either `192.168.0` or `192.168.1` or `10.0.0` then this should work for you

1.  [run the server](../README.md#running-the-examples),
2.  Tell your friends to connect to your Wifi
3.  Tell your friends to go to [http://happyfuntimes.net](http://happyfuntimes.net)

That should auto connect them to the your game. It does this by scanning
the machines those subnets listed above and setting if it can find the server.
If it does it goes there.

Note: The game/server and your friends must be on the same WiFi. If the machine
running your game is on your private WiFi and your friends are on the guest WiFi
it won't work.

Solution #2: Configure a router just for HappyFunTimes
======================================================

The next easist solution is to setup a network router that redirects all traffic
to the relaysever. That way users can connect to your router and going to any webpage
will take them to the game. Even better, in iOS, we can use its captive portal
detector to go directly to the game the moment someone connects to the Wifi.
They don't have to type anything. Android users will have to go to any domain.
Tell them "hft.com"

**Is turns out it's not that hard**

We're going to tell the router to give the relayserver a specfiic IP address.
The relayserver has an option to handle DNS so we're going to setup a router
so it tells all devices connecting to it to ask the relayserver for DNS info.
This well let us serve our game pages no matter what URL is typed. It will
also let us auto join on iOS.

Setup
-----

First, get a router. You probably have an old one or if you want to be portable I
recommend the [TP-Link TL-WR702N](http://google.com/#q=TP-Link+TL-WR702N) though
it will only handle 13-14 players.

Go to your router's admin page and find the DHCP settings. Somewhere there
should be a place that lets you assign a specfiic IP address to a specific MAC
address. On TL-WR702N that's under Advanced Settings->DHCP->Address Reservations

I looked up the MAC address for my machine (the relayserver) and assigned it
directly to `192.168.2.9`.

<div style="text-align: center;"><a href="images/router-address-reservation.png"><img width="342" height="184" src="images/router-address-reservation.png"></a></div>

I then went to the main DHCP settings at Advanced Settings->DHCP->DHCP Settings and
configured it to give out IP addresses from to `192.168.2.10` to `192.168.2.250`.
Finally I set the DNS there to the same address I used for the relayserver
(`192.168.2.9`)

<div style="text-align: center;"><a href="images/router-dhcp-settings.png"><img width="343" height="224" src="images/router-dhcp-settings.png"></a></div>

With that done I picked a nice name for my WiFi's SSID under
Basic Settings->Wireless->Wireless Settings

<div style="text-align: center;"><a href="images/router-wifi-settings.png"><img width="390" height="237" src="images/router-wifi-settings.png"></a></div>

and in my case I decided to turn off security so no password is needed.

<div style="text-align: center;"><a href="images/router-wifi-security.png"><img width="375" height="221" src="images/router-wifi-security.png"></a></div>

I'm not sure that's the best idea since lots of people's devices are set to automatically
connect to open routers.

With that done, reboot the router, connect your machine, then open a command prompt
and type

    sudo node server/server.js --dns

You need `sudo` because port 80 is normally restricted.

Go to `http://localhost/games.html` and pick a game.

Now try connecting a smartphone to your router. If it's an iOS device it *should*
automatcally come up with a page that says "Start". If it's an Android device
open the browser and go to 'hft.com'

This should also work on Windows but you might need to create a prompt with admin
access? I don't have a Windows box at the moment to check.

Using your router for normal internet access
--------------------------------------------

Once you've made these changes on your router the only things you should need to
to use it as a normal router again are

1.  Clear the DNS address in your DHCP settings

    You set the DNS address to point to the machine being the relayserver. Either
    clear that setting or set it to a real DNS server like Google's Public DNS servers
    `8.8.8.8` and `8.8.4.4`

2.  Turn security back on

    If you make your WiFi open/unsecured you probably want to turn that back on

Maximum Number of Players
=========================

Apparently the TP-Link TL-WR702N only supports around 15 wireless devices at a time which
means the main computer running the game and 14 players.

[Netgear claims their dual band routers can support 64 devices](http://kb.netgear.com/app/answers/detail/a_id/24043/~/how-many-clients-can-you-connect-wirelessly-to-a-netgear-router%3F).
Unfortunatly netgear routers don't allow you to change the DNS server their DHCP server reports
so avoid them. They always report themsevles and/or they always look on the WAN for resolution
instead of the LAN. If you're lucky you can install a different firmware but otherwise avoid them.

[Apple claims 50 devices with the Airport Extreme](http://www.apple.com/airport-extreme/specs/)
though it's ambigous if that means 50 wifi devices or something else.

[Buffalo claims between 10 and 50 depending on the device](http://faq.buffalo.jp/app/answers/detail/a_id/326).

This is all pretty frustrating. It would be nice to know the least expensive way to allow lots
of players. If you're a network guru please contact me or submit a pull request with updates
on what's best. Especially given the specfic needs of HappyFunTimes. We're not streaming video
or dowloading torrents so for example, rather than buying the top end routers consumer routers
maybe it's better to by 2 to 4 cheap home routers and set all but one of them into AP mode (Access Point)?
Or should we go to business routers? Unfortunately at this time I have no idea.

