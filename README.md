## TranCore
A translation and pronunciation browser extension.

## TODO
- Implement some kind of caching for previously loaded words.
- [x] The Ability to detect the word language
     - Enhancing the detection capability using external robust API.
- Showing a more robust tooltip UI.
     - Fix textarea stray tooltip glitch.
     - Changing the play button icon.
     - A more expanded and structured layout for the tooltip.
- Further refinement on the audio i..e displaying the audio, then closing the previous one if another is played (preventing collapsing/overlapping)
- Adding the ability to load additional pronunciations.
  	- The link to load additional pronunciations will be conditionally/optionally displayed, depending on whether or not there's even additional pronunciations.
  		- The check of whether additional pronunciations are existent is done with the help of check of an rock-bottom element at the initial page.
- Adding the ability to load other additional translations.
  	- This can be achieved with the help of a small link on top of the pronunciations.
  		- When the link is clicked, and everything is fetched, and ready to be displayed, it should substitute the current pronunciations view, with the translations one, but with the option to go back.
  			- I guess i should be targeting the recordings Div for that.
- [x] The ability to fall back to generic English (British/American) translation, if either British/American is devoid of pronunciation, but the general English has translations
- [x] Avoid selecting non-alphabetical characters
- [x] Add support for phrasal verbs, by having a threshold of 2 words, as the maximum allowed limit of selected words
- Stop any currently running sounds before continuing to run any next one
- Instead of trying so hardly to highlight a word that's embedded in a link (trying hard to highlight the word without click the link), add the ability to hover the mouse cursor for a bit, then an icon should pop up asking whether to show pronunciation for the currently hovered-over word
     - The 'mouseover' event should be a good starting point.
- Another forbidden character should be added to the 'space' character. I guess a uniform list of them would be more appropriate.
- Substitute the first lower direct pronunciation, with a hovering popover (on the top), displaying options for either translation, pronunciation, or other stuff