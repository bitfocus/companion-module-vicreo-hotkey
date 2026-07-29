## VICREO Hotkey Listener

A Companion module for controlling VICREO Hotkey Listener - enables remote keyboard automation and hotkey simulation for broadcast, live streaming, and production environments.

### About

This module connects to the VICREO Listener application to send keyboard commands, hotkey combinations, and mouse actions to remote computers. VICREO Listener is a small program that sits on your machine waiting for incoming TCP connection/commands. It uses pre-defined commands to simulate key-presses on your machine. You can use this program to perform hotkey actions from remote.

### Requirements

- VICREO Listener application installed on target machine
- Network connectivity between Companion and target machine
- For advanced features (mouse actions, shell commands, etc.), a VICREO license is required

### Download VICREO Listener

Go to [VICREO Listener](https://vicreo-listener.com) for download.

### Support

When you have an issue let me know at: [https://github.com/bitfocus/companion-module-vicreo-hotkey/issues](https://github.com/bitfocus/companion-module-vicreo-hotkey/issues)

## Usage

Download and run the application on the remote computer (local is also possible). In companion, fill in the IP address of the remote computer or 127.0.0.1 if installed on the same machine.

From version 8.0.0 its possible to use the Bonjour service to find a listener on the network.

> > Check the build in presets!

## SUPPORTED ACTIONS

- Single hotkey
- Special key (see keylist)
- Combination of keys

> > After this you would need a license. Go to [VICREO Listener](https://vicreo-listener.com/license) to get one.

- trio combination of keys
- quartet combination of keys
- Separate key press
- Separate key release
- MousePosition
- MouseClick
- MouseScrolling
- Send a string
- Send Shell command
- Open a file remotely
- Send key directly to a process
- Process watchdog (see below)

## Keys

> The following keys are supported:

Backspace
Delete
Enter
Tab
Esc
Arrow up
Arrow Down
Arrow Right
Arrow Left
Home
End
Page Up
Page Down
F1
F2
F3
F4
F5
F6
F7
F8
F9
F10
F11
F12
Command/Win
Option/alt
Control
Shift
Right-Shift
Space(bar)
Leftmouse
Rightmouse

## Check out the special keys !

Some functions might not work on different OS

Audio mute (toggle)
Audio volume down
Audio volume up
Play
Stop
Pause
Previous track
Next track
Numpad 0
Numpad 1
Numpad 2
Numpad 3
Numpad 4
Numpad 5
Numpad 6
Numpad 7
Numpad 8
Numpad
Monitor brightness up
Monitor brightness down
Insert
Keyboard light up
Keyboard light down
Printscreen

### Open a file

Goto presets and drag-drop [Open Notepad]. This will give you the right example how to do this.

### TIPS for MacOS

For mac, when you need the path of a file, right-click on the file and when you see the menu, press and hold Alt to be able to copy the full path.

When using Powerpoint for mac, you can program a goto slide via a process. Use the 'Send KeyPress To MacOS Process' action and fill the process name (in this case Microsoft Powerpoint, you can search for it in activity monitor on the mac) and select the desired key. For example ANSI_3. Then use a bit delay (30ms) on the same button for the ANSI_KeypadEnter.

> > When using file paths make sure you put " around the path, like: "filepath"

### TIPS for Windows

For Windows, when you need to open a file, right-click on the file while pressing Shift, to be able to copy the full path. Leave it all as it is (wrong slashes and ")
There is an example preset to open notepad.

### Mouse Position and click

From version 4.0.10 upwards there is control over the mouse via position and a click (left, right, middle button, double click)

### Process watchdog

Watch applications on the target machine and see on a button when one stops running or hangs. Windows and macOS only, and it needs a Pro license.

**Setting it up.** In the connection config, fill in **Watch these processes** with a comma separated list and set a check interval. Those processes are watched automatically, including after a reconnect. Use the process name as the machine knows it:

- Windows: the executable, e.g. `chrome.exe`, `POWERPNT.EXE`. The `.exe` is optional.
- macOS: the application name or bundle id, e.g. `Keynote`, `Google Chrome`, `com.apple.Keynote`.

You can also start and stop the watch from a button with the **Subscribe to data** action, choosing `process state (watchdog)`. That replaces whatever the config set, for the rest of the session.

**Variables.** Each watched process gets four, with the name lowercased and punctuation turned into underscores, so `chrome.exe` becomes `chrome_exe`:

| Variable | Value |
| --- | --- |
| `$(vicreo-hotkey:process_chrome_exe_running)` | `true` / `false` |
| `$(vicreo-hotkey:process_chrome_exe_frontmost)` | `true` / `false` |
| `$(vicreo-hotkey:process_chrome_exe_responsive)` | `true` / `false` / `unknown` |
| `$(vicreo-hotkey:process_chrome_exe_pid)` | process id |

They go blank while the connection is down, so a button never shows a stale "running".

**Feedback.** Use **Process state (watchdog)** to style a button. Fill in the process name exactly as you watch it and pick the condition — "Process is NOT running" is the usual alarm. There are ready made buttons in the **Watchdog** preset category.

**About "responsive".** This asks the application whether its event loop still answers, which is how a frozen-but-running app is caught. It reports `unknown` when it genuinely cannot be established: a background process with no window, or on macOS an app that is not a normal windowed application. On macOS the Listener needs Accessibility permission for this, the same permission it already needs to send keystrokes. `unknown` never triggers the "hung" feedback.

**Reporting.** By default a report is only sent when something changes, so the network stays quiet. Tick "Report every interval" on the action if you want a message on every check. The interval is clamped to at least 1000 ms, and at most 20 processes can be watched at once.
