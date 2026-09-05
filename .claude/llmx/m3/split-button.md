# Split buttons

slug: split-buttons · updated: 2026-07-29 · source: m3.material.io

## §Overview

- Use to show an action with a menu of related actions
- Same size range as buttons and icon buttons: XS, S, M, L, XL
![image] An extra large split button. It has a label and icon on one part of the button, and a menu icon on the other part.
_Split buttons are made of a common button and a menu icon button_
## Availability & resources
[module: STATUS_TABLE · designSystems/030656e0a1083ef1/components/27634f809ff5f396]
## M3 Expressive update
**May 2025**
The split button has a separate menu button that spins and changes shape when activated. It can be used alongside other buttons of the same size. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)
New component added to catalog.

Sizes:
- Extra small
- Small
- Medium
- Large
- Extra large
Color styles:
- Elevated
- Filled
- Tonal
- Outlined
![image] 5 sizes of split buttons.
_Split buttons have the same five recommended sizes as label and icon buttons_

## §Specs

## Variants
![image] 1 type of split button.
__
| | Variant
 |  M3
 | M3 Expressive

| Split button

 | --
 | Available
## Configurations
![image] 4 colors and 5 sizes of split buttons.
_- Color configurations: Elevated, filled, tonal, outlined

- Size configurations: XS, S, M, L, XL_
| | Category
 | Configuration
 |  M3
 | M3 Expressive

| Size

 | XS, S, M, L, XL

 | --
 | Available

| Color

 | Elevated, filled, tonal, outlined

 | --
 | Available
## Tokens & specs
Use the table's menu to select a token set. Split button token sets are organized by size. [Learn about design tokens](/m3/pages/design-tokens/overview/)
[module: TOKEN_TABLE · designSystems/20543ce18892f7d9/components/624e8f2da4007fc8]
```json
{"tokenSets":["Split button - Size - Xsmall","Split button - Size - Small","Split button - Size - Medium","Split button - Size - Large","Split button - Size - Xlarge"],"contextTags":["None","Medium contrast","Default","High contrast","Compose","3P","Web","Android","Dark","Light"],"tokenSetOrder":["Button - Color - Elevated","Button - Color - Filled","Button - Color - Tonal","Button - Color - Outlined","Split button - Size - Xsmall","Split button - Size - Small","Split button - Size - Medium","Split button - Size - Large","Split button - Size - Xlarge"],"hideSearchField":false,"hideVersionName":true}
```
## Anatomy
![image] 4 elements of a split button.
_- Leading button

- Icon

- Label text

- Trailing button_
The leading button in split buttons can have an icon, label text, or both. The trailing button should always have a menu icon.
![image] 3 customizations of the leading button in the split button.
_- Label + icon

- Label

- Icon_
## Color
Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value.
Split buttons use the same color schemes as standard buttons. However, unlike toggle buttons, the split button color doesn’t change when selected—only a state layer is applied.
Split buttons use the same colors and state layers as buttons, shown in the following token module. [Go to buttons](/m3/pages/common-buttons/overview) for more details.
![image] 4 color roles of the split button when unselected and selected in light and dark theme.
_A: Unselected, B: Selected trailing icon

- Elevated

- Filled

- Tonal

- Outlined_
[module: TOKEN_TABLE · designSystems/20543ce18892f7d9/components/624e8f2da4007fc8]
```json
{"tokenSets":["Button - Color - Elevated","Button - Color - Filled","Button - Color - Tonal","Button - Color - Outlined"],"contextTags":["None","Medium contrast","Default","High contrast","3P","Android","Dark","Light"],"tokenSetOrder":["Split button - Size - Xlarge","Split button - Size - Large","Split button - Size - Medium","Split button - Size - Small","Split button - Size - Xsmall","Button - Color - Elevated","Button - Color - Filled","Button - Color - Tonal","Button - Color - Outlined"],"hideSearchField":false,"hideVersionName":true}
```
## States
States are visual representations used to communicate the status of a component or an interactive element. 
Split button states use the same colors and state layers as buttons and icon buttons. Go to those specs for details.
### Leading button shape
The inner corners change shape for hovered, focused, and pressed states.
![image] 5 states of the leading button in the split button.
_- Enabled

- Disabled

- Hovered

- Focused

- Pressed, pressed with focus_
### Trailing button shape
The inner corners change shape for hovered, focused, and pressed states, and the icon becomes centered when selected.
![image] 6 states of the trailing menu button in the split button.
_- Enabled

- Disabled

- Hovered

- Focused

- Pressed, pressed with focus

- Selected, selected with focus_
## Measurements
Text and icons are optically centered when the buttons are asymmetrical. They’re centered normally when symmetrical.
![image] Padding and size measurements of the split button.
_Menu icon offset when unselected:
- XS: -1dp from center
- S: -1dp from center
- M: -2dp from center
- L: -3dp from center
- XL: -6dp from center_
The inner corner radius changes depending on button sizing. The space should always be 2dp.
![image] Inner padding and inner corner measurements of the split button.
_- Extra small 4dp

- Small 4dp

- Medium 4dp

- Large 8dp

- Extra large 12dp_

## §Guidelines

![image] Split buttons of many colors and sizes scattered.
_Split buttons come in many sizes and colors_
## Usage
Split buttons are used to add a menu of actions alongside a main action. This reduces visual complexity by hiding extra options. Split buttons work well alone or alongside common buttons and icon buttons.
![image] A split button applied a filter of “Canada” to a list of activities. Three narrow buttons are next to it to share, favorite, and bookmark.
_Split buttons on their own can grab attention_
Split buttons have five recommended sizes. These sizes match the sizes offered on buttons and icon buttons:
- Extra small

- Small (default)

- Medium

- Large

- Extra large

Scale up the split button in large breakpoints, or to create more emphasis in smaller windows.
![image] A large split button in a compact window draws attention to buying an enamel mug in an online store.
_Using large split buttons on small screens can add extra emphasis for hero moments_
Split buttons can be used alongside other buttons and button groups.
![image] A vibrant split button for starting a car drive is next to 2 muted icon buttons for bookmarking and sharing the trip.
_Split buttons work harmoniously with regular buttons_
Split buttons can be of different sizes from other buttons on the page, especially since they take up more space.
![image] A media player has a split button for changing the speed quickly, or opening a menu of options.
_The most prominent controls can be larger while secondary controls in a split button can be smaller_
The split button typically opens a menu, but can be customized to open other components like cards.
![image] A split button opens a menu with a vibrant color scheme.
_Open a menu from a split button_
![image] A split button opens a menu with an irregular shape highlighting the selected item.
_Avoid modifying the menu in unusual ways_
## Anatomy
![image] 4 elements of a split button.
_- Leading button

- Icon

- Label text

- Trailing button_
The leading button should be brief, just one or two words, with an icon that best matches the action.

The trailing button should always have the expand and collapse icon since it rotates when selected. Avoid modifying the icon.
![image] A split button for starting driving directions has a label “32 minutes away” and a refresh icon instead of a menu icon.
_Avoid using very long labels or changing the trailing icon_
In right-to-left languages, the component layout is mirrored.
![image] The split button elements are reversed in a right-to-left language.
_Split buttons mirror the order of elements in right-to-left languages_
## Behavior
The split button uses the standard motion scheme (not the expressive motion scheme) when rotating the menu button.
The menu button rotates inwards 180° when opened and closed.
![image] The trailing menu button spins 180° to point up, and applies a 10% state layer when selected.
_Selecting the menu button rotates the icon inwards and applies shape morph_
### Menu placement
When using the split button with a menu, align the menu with the trailing button when possible.
![image] A split button with an open menu. The leading edge of the menu is aligned to the leading edge of the menu button.
_Align the menu with the trailing button_
If there’s not enough room, align the menu to one of the sides of the button.
![image] A split button with an open menu. The trailing edge of the menu is aligned to the trailing edge of the menu button.
_If not possible, align the menu to the side of the leading or trailing button_
Depending on breakpoint, scroll position, and other factors, the menu may need to appear elsewhere around the button. Always try to align it with one of the edges of the button.
The menu should be 4dp from the split button.
![image] 6 other ways the menu can align to the split button.
_- Top aligned to trailing button

- Bottom aligned to trailing button

- Top right-aligned

- Top left-aligned

- Bottom right-aligned 

- Bottom left-aligned_

## §Accessibility

## Use cases
People should be able to do the following using assistive technology:
- Navigate to each button and interact with them
- Navigate to any element opened by the trailing button
- Understand the current selection state of the button
## Interaction & style
Each button in the split button needs a minimum target area of 48x48dp. Extra small and small split buttons are shorter than 48dp, so the target areas around them need to be at least 48dp tall.
![image] Diagram showing extra small and small split buttons with visible 48x48dp target areas.
_Target areas should be at least 48x48dp 

- Extra small

- Small_
## Initial focus
Focus should land on the leading button then move to the trailing button. This can depend on the operating system’s settings.
![image] Focus on the leading button and trailing button for both LTR and RTL languages.
_- Left to right

- Right to left_
## Keyboard navigation
| | Keys
 | Actions

| Tab | Navigate between buttons
| Space or enter | Activate focused button
## Labeling elements
The accessibility label for the leading button is the same as buttons.
![image] “Watch later” is both the button label text and the accessibility label.
_Leading buttons should have the same labels as common buttons_
The trailing icon button should have an extra state or similar label indicating that the menu is expanded or collapsed.

Label the button to clearly indicate that there are more options. The label of the secondary button should indicate that it provides additional choices related to the action of the main button. For instance, if the main button says "Watch later," the secondary button should be something like "More watch options."

Label the opened menu according to the [menu accessibility guidance](/m3/pages/menus/accessibility/).
![image] Collapsed state indicated for the trailing button.
_Trailing buttons should communicate the state of the menu and that more options are available_
