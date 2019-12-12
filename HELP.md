## VICREO Hotkey
This module connects to the VICREO Listener program which you need to download and run on the remote machine.

>  VICREO Listener is a small program that sits on your machine waiting for incomming TCP connection/commands. It uses pre-defined commands to simulate keypresses on your machine. You can use this program to preform hotkey actions from remote.

Go to [VICREO hotkey](http://vicreo.eu/hotkey) for download.

## Usage

> Make sure you use the backslash in the file open command

## Modifiers ##

>The following modifiers are supported:

alt
ctrl
tab
shift
cmd
alt_gr
delete
backspace
space
caps_lock
end
enter
esc
f1
f2
f3
f4
f5
f6
f7
f8
f9
f10
f11
f12
home
insert (only windows)
left
right
up
down
num_lock (only windows)
page_up
page_down

## TIPS for MacOS ##

For mac, when you need the path of a file, right-click on the file and when you see the menu, press and hold Alt to be able to copy the full path.

When using powerpoint for mac, you can program a goto slide via a process. Use the 'Send KeyPress To MacOS Process' action and fill the process name (in this case powerpoint, you can search for it in activity monitor on the mac) and select the desired key. For example ANSI_3. Then use a bit delay (30ms) on the same button for the ANSI_KeypadEnter.
For this to work you would need to run minimum version 1.4 of the VICREO-Listener.

Check the build in presets!
