# DeckShot
DeckShot crops out your deck from your Hearthstone screenshots. It also features a view of the newest deck, so this can be added as a window-view in OBS.

## Feature roadmap
- Cropping out deck-list from screenshots in 'My Collection'
	- Automatic detection of new screenshots on desktop (from Hearthstone) (done)
	- Cropping of decks not filling the list vertically (done)
	- Cropping of decks filling the list exactly vertically
	- Concatenation of two screenshot of the same deck, one scrolled to the top, other scrolled to the bottom
	- Detection of whether the screenshot were done in the 'My Collection' view, with a deck shown
- UI
	- Showing the newest DeckShot in a frameless, draggable window (done)
		- Reserves space vertically with a key-color to be filtered out by OBS (done)
	- A main window with access to configuration and possibility to show/hide DeckShot view
- Configuration
	- Screenshot folder (defaults to Desktop)
	- DeckShot folder, where cropped out decks will be saved
	- Auto-delete screenshot from screenshot folder, once DeckShot has been created
	- Optional key-color for OBS
	- Streaming mode on/off

### Streaming mode

When in streaming mode, the DeckShot-view will reserve extra vertical space, to take into account longer decks. This is needed because OBS does not handle resizing of window-captures very well. This extra space will be filled by a key-color that can be filtered out by OBS.