## VICREO Listener

VICREO Listener is a small background application for Windows, macOS and Linux that listens on TCP port 10001 and carries out what it is told to do inside the logged-in desktop session: press keys, type text, move and click the mouse, run a shell command, open a file, bring a window to the front, and report whether an application is still running and responding. This module lets Companion drive and watch such a machine over the network, so a playback, presentation or graphics computer that nobody is sitting at can still be operated — and can raise an alarm on a button when the software on it stops or hangs.

### Download the Listener

The application is a separate download: **[vicreo-listener.com](https://vicreo-listener.com)**

Signed and notarised builds for macOS and Windows; a `.deb` for Linux is in beta.

### Setup in three steps

1. **Install and start the Listener on the target machine.** On macOS, allow it under System Settings → Privacy & Security → Accessibility; without that permission it cannot send keystrokes. The machine may also be the one Companion itself runs on.
2. **Add the connection in Companion.** Use **Find on the network** (Bonjour, from Listener 8.0.0 onwards) or fill in **Target IP** by hand — `127.0.0.1` if the Listener runs on the same machine. The port is `10001` unless you changed it. Fill in the password only if the Listener asks for one.
3. **Test it.** Put the **Single key** action on a button and pick, say, `F5`. Or drag one of the built-in presets onto a page and press it — the preset categories cover Keynote, PowerPoint for Mac, Audio, Mouse, Windows, OSX, Watchdog and Misc.

The **VICREO Listener version** variable fills in once the connection is up, which is the quickest confirmation that Companion and the Listener are talking.

### Free versus licensed

| What you can send                                                              | Free | License |
| ------------------------------------------------------------------------------ | :--: | :-----: |
| Single key, special key, two-key combination                                   |  ✔️  |   ✔️    |
| Three- and four-key combinations, separate key down / key up                   |      |   ✔️    |
| Mouse position, click, hold and release, scroll, read position                 |      |   ✔️    |
| Type a string of text                                                          |      |   ✔️    |
| Shell command, open a file                                                     |      |   ✔️    |
| Send a key straight to a named process (macOS), window to foreground (Windows) |      |   ✔️    |
| Process watchdog: running, frontmost, responsive                               |      |   ✔️    |
| Subscriptions and custom JSON actions                                          |      |   ✔️    |

Actions that need a license are marked **(pro-action)** in the action dropdown.

## Actions

**Keyboard**

- Single key
- Special key (see the key lists below)
- Combination — two keys
- Three keys (pro-action)
- Four keys (pro-action)
- Key press, down (pro-action)
- Key release, up (pro-action)
- special key OS dependent (pro-action)
- Send KeyPress To MacOS Process (pro-action)

**Text and mouse**

- Send stringmessage — types a string, variables allowed
- Change mouse position (pro-action)
- Click the mouse (pro-action) — left, right, middle, double
- Hold mouse button down (pro-action)
- Release mouse button (pro-action)
- Scroll the mouse (pro-action)
- Get the position of the mouse on screen

**System**

- Send shell command (pro-action)
- Open a file (pro-action)
- Set a Window to foreground (pro-action, Windows only)
- Subscribe to data (pro-action) — mouse position or process state (watchdog)
- Custom action (pro-action) — send raw JSON to the Listener
- Set License Key

## Keys

The following keys are supported:

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

## Special keys

Some of these do not exist on every operating system.

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

## Process watchdog

Watch applications on the target machine and see on a button when one stops running or hangs. Windows and macOS only, and it needs a Pro license.

**Setting it up.** In the connection config, fill in **Watch these processes** with a comma separated list and set a check interval. Those processes are watched automatically, including after a reconnect. Use the process name as the machine knows it:

- Windows: the executable, e.g. `chrome.exe`, `POWERPNT.EXE`. The `.exe` is optional.
- macOS: the application name or bundle id, e.g. `Keynote`, `Google Chrome`, `com.apple.Keynote`.

You can also start and stop the watch from a button with the **Subscribe to data** action, choosing `process state (watchdog)`. That replaces whatever the config set, for the rest of the session.

**Variables.** Each watched process gets four, with the name lowercased and punctuation turned into underscores, so `chrome.exe` becomes `chrome_exe`:

| Variable                                         | Value                        |
| ------------------------------------------------ | ---------------------------- |
| `$(vicreo-hotkey:process_chrome_exe_running)`    | `true` / `false`             |
| `$(vicreo-hotkey:process_chrome_exe_frontmost)`  | `true` / `false`             |
| `$(vicreo-hotkey:process_chrome_exe_responsive)` | `true` / `false` / `unknown` |
| `$(vicreo-hotkey:process_chrome_exe_pid)`        | process id                   |

They go blank while the connection is down, so a button never shows a stale "running".

**Feedback.** Use **Process state (watchdog)** to style a button. Fill in the process name exactly as you watch it and pick the condition — "Process is NOT running" is the usual alarm. There are ready made buttons in the **Watchdog** preset category.

**About "responsive".** This asks the application whether its event loop still answers, which is how a frozen-but-running app is caught. It reports `unknown` when it genuinely cannot be established: a background process with no window, or on macOS an app that is not a normal windowed application. On macOS the Listener needs Accessibility permission for this, the same permission it already needs to send keystrokes. `unknown` never triggers the "hung" feedback.

**Reporting.** By default a report is only sent when something changes, so the network stays quiet. Tick "Report every interval" on the action if you want a message on every check. The interval is clamped to at least 1000 ms, and at most 20 processes can be watched at once.

## Mouse position and click

From Listener 4.0.10 upwards there is control over the mouse via a position and a click (left, right, middle button, double click). **Get the position of the mouse on screen** writes the current position into the `mouseX` and `mouseY` variables, which is the easy way to find the coordinates you need.

## Opening a file

Go to the presets and drag in **Open Notepad**. That preset shows the exact format.

**macOS.** To get the path of a file, right-click it, and while the menu is open press and hold Alt to copy the full path. Put quotes around a path that contains spaces, like `"filepath"`.

**Windows.** Right-click the file while holding Shift to copy the full path. Leave it exactly as Windows gives it to you, backslashes and quotes included.

## Tips for macOS

When using PowerPoint for Mac you can jump to a slide through a process. Use the **Send KeyPress To MacOS Process** action, fill in the process name (in this case Microsoft PowerPoint — you can look it up in Activity Monitor) and select the key, for example `ANSI_3`. Then add a small delay (30 ms) on the same button for `ANSI_KeypadEnter`.

## Beyond Companion

The Listener does not depend on Companion. It accepts plain JSON over a TCP socket, so anything that can open one can drive it: COGS, Medialon, QLab, Crestron, Node-RED or your own scripts. The **Custom action** in this module sends raw JSON, which makes it a convenient way to try out a command before wiring it up elsewhere.

## Support

Issues with the module: [github.com/bitfocus/companion-module-vicreo-hotkey/issues](https://github.com/bitfocus/companion-module-vicreo-hotkey/issues)
