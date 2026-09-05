# Tooltips

slug: tooltips · updated: 2026-07-17 · source: m3.material.io

## §Overview

- Use tooltips to add additional context to a button or other UI element

- Two variants: plain and rich

- Use plain tooltips to describe elements or actions of icon buttons

- Use rich tooltips to provide more details, like describing the value of a feature

- Rich tooltips can include an optional title, link, and buttons
![image] 2 variants of tooltips.
_- Plain tooltip
- Rich tooltip_
## Availability & resources
[module: STATUS_TABLE · designSystems/030656e0a1083ef1/components/1ddd05a1e6a16969]
## Differences from M2
- **Color**: New color mappings and compatibility with dynamic color

- **Shape**: Rich tooltips have more rounded corners
![image] GM2 rich tooltip.
_M2: Rich tooltips have slightly rounded corners_
![image] GM3 rich tooltip.
_M3: Rich tooltips have more rounded corners and support dynamic color_

## §Specs

## Tokens & specs
Select a component variant below to see its attributes, tokens, and values.
[module: TOKEN_TABLE · designSystems/20543ce18892f7d9/components/37697297db0555a6]
```json
{"tokenSets":["Tooltip - Plain","Tooltip - Rich"],"contextTags":["None","Medium contrast","Default","High contrast","Static","3P","Android","Dark","Light"],"hideSearchField":false,"hideVersionName":true}
```
## Plain tooltip
![image] 2 elements of a plain tooltip.
_- Supporting text
- Container_
### Plain tooltip colors
Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)
![image] 2 color roles of a plain tooltip.
_Plain tooltip color roles used for light and dark themes:
- Inverse on surface
- Inverse surface_
### Plain tooltip measurements
![image] Measurements of a plain tooltip.
_Plain tooltip padding and size measurements_
| | Attribute
 | Value

| Container height
 | 24dp

| Padding
 | 8dp
## Rich tooltip
![image] 4 elements of a rich tooltip.
_- Subhead
- Container
- Supporting text
- Text button_
### Rich tooltip colors
Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)
![image] 4 color roles of a rich tooltip.
_Rich tooltip color roles used for light and dark themes:
- On surface variant 
- Surface container
- On surface variant 
- Primary_
### Rich tooltip measurements
![image] Measurements of a rich tooltip.
_Rich tooltip padding and size measurements_
| | Attribute | Value
| Top padding | 12dp
| Bottom padding | 8dp
| Left and right padding | 16dp
### Rich tooltip configurations
Rich tooltips can have a headline, body, and up to two buttons. The headline and number of buttons can be configured.
![image] 5 common configurations of a rich tooltip.
_- Subhead, supporting text, and two buttons
- Subhead, supporting text, and one button
- Subhead and supporting text
- Supporting text and one button
- Supporting text and two buttons_

## §Guidelines

![image] A plain tooltip labeling a button, and a rich tooltip announcing new settings available.
_Plain and rich tooltips serve different purposes_
## Usage
A tooltip provides additional context for a UI element. 
**Plain tooltips**
Plain tooltips briefly describe a UI element. They're best used for labelling UI elements with no text, like icon-only buttons and fields.
**Rich tooltips**
Rich tooltips provide additional context about a UI element. They can optionally contain a subhead, buttons, and hyperlinks.
Rich tooltips are best used for longer text like definitions or explanations.
![image] 2 variants of tooltips.
_- Plain tooltip
- Rich tooltip_
![image] Plain tooltip labeling an icon-only button in Google Meet as "Present now".
_Use plain tooltips to label icon-only buttons_
![image] Button with an icon and label text saying "Edit". It has a plain tooltip on hover that also says "Edit".
_Plain tooltips aren't needed when the UI element already has label text_
![image] Rich tooltip describing a new button for adding people. It has a subhead, description, and a button to learn more.
_Use rich tooltips to provide extra information and actions about a UI element or new feature_
![image] Rich tooltip explaining that an action is destructive and permanently deletes files.
_Don't hide critical information within tooltips as it’s easy to miss. Use an interruptive dialog instead._
## Anatomy
### Plain tooltip
![image] 2 elements of a plain tooltip.
_- Container
- Supporting text_
### Supporting text
![image] Plain tooltip for an icon-only button shaped like a gear. The tooltip text is "Settings".
_Briefly describe a UI element_
![image] Plain tooltip for the account switcher. The supporting text includes the user's name and email address on new lines.
_Avoid wrapping text to multiple lines or including many pieces of information_
### Rich tooltip
![image] 4 elements of a rich tooltip.
_- Subhead (optional)
- Container
- Supporting text
- Text button (optional)_
### Subhead (optional)
Keep subheads brief, ideally to one line. They should summarize or describe the message of the rich tooltip.
Subheads are important to include when the rich tooltip appears automatically, like when the page loads.
![image] Rich tooltip with a brief subhead, supporting text, and a text button.
_Summarize the message in a few words_
![image] Rich tooltip with a subhead wrapping to multiple lines.
_Avoid wrapping to more than one line_
### Text buttons (optional)
Rich tooltips can have up to two text buttons. These should be brief and relevant to the message in the supporting text.
Keep buttons short so they can be side by side. Avoid stacking them when possible.
![image] Rich tooltip with 2 buttons stacked on each other.
_Avoid stacking buttons_
## Placement
### Plain tooltips
By default, plain tooltips are positioned directly above the parent element. 
- If there's a visual boundary, like a button, the distance is 4dp
- If there's no visual boundary, like with text baselines, the distance is 8dp
If the element is in an app bar, the plain tooltip appears below the element at the same distance.
![image] Plain tooltip appearing 4dp below a button with a clear visual boundary.
_Plain tooltip with a 4dp distance between the target and tooltip_
### Rich tooltips
By default, rich tooltips are positioned to the bottom right of the parent element. They adjust position to avoid going off screen.  Tooltips shouldn't cover the parent element. 
**Dynamic positioning**
The position of the tooltip adjusts in increments of 8dp to avoid going off-screen.
**Desktop placement**
On desktop, tooltips may appear centered below the parent element and remain visible while moving within the target region.
![image] A rich tooltip in 4 different corners. It   changes position to remain fully on screen.
_Four different rich tooltip locations based on dynamic positioning_
## Behavior
To show a tooltip, hover on the parent element on desktop, or tap and hold the element on mobile. Persistent rich tooltips only appear when clicked or tapped.
### Transient by default
Both plain and rich tooltips disappear 1.5 seconds after navigating away from the target region.
Triggering a new tooltip immediately closes any other open tooltip.
![image] Hovering and moving from a button with a plain tooltip.
_Tooltips disappear after a 1.5 second delay when no other element is hovered_
![image] 2 buttons both showing plain tooltips at once.
_Only display one tooltip at a time_
### Persistent rich tooltips
Persistent rich tooltips appear when either:
- The parent element is clicked
- The page loads and a new feature is being explained
Persistent rich tooltips remain active even when leaving the target region. They only disappear once a person interacts with another UI element. Hovering doesn't trigger the tooltip.
When appearing on page load, the tooltip can introduce and explain new features on various parent elements.
Avoid using persistent rich tooltips on icon buttons.
![image] Persistent rich tooltip about a new sharing feature in the Photos app. The button says  "Learn more.”
_Don’t use a persistent rich tooltip on icon buttons_

## §Accessibility

## Use cases
People should be able to do the following using assistive technology:
- Receive a tooltip message
- Activate a tooltip with a keyboard or switch input
## Interaction & style
Plain and rich tooltips without required actions should remain on screen long enough for people to receive the information without disrupting their existing flow or task.
![image] A cursor hovers over an icon that identifies it as a star, which remains after moving away.
_Plain tooltips should remain on the screen temporarily after the cursor moves away_
Tooltips can appear when an actionable element, like a button or navigation rail, is hovered or focused. However, this tooltip shouldn’t hide crucial information.
Rich tooltips can also appear by selecting an element instead of hovering or focusing on it.
![image] A cursor hovers over a favorite button producing text about finding this item later in favorites.
_Tooltips can appear on hover or focus to explain actions_
![image] An information button in a selected state produces text about finding this item later in favorites.
_Rich tooltips can appear when an element is selected_
## Focus order
Tooltip containers should not block important information or prevent a person from completing an action. 
Focus order within the rich tooltip moves top to bottom between interactive elements. 
Avoid trapping screen reader and keyboard focus on rich tooltips.
People should be able to move linearly through the rest of the page.
![image] Different elements of a rich tooltip are given a focus order, moving from parent element to inline link to text button.
_- Parent element
- Inline link
- Text button_
## Keyboard navigation
| | **Keys**
 | **Actions**

| **Tab**
 | Focus lands on button, if available

| **Space** or **Enter**
 | Activates the focused element
## Labeling elements
Tooltips should have the **Tooltip** role, or similar. 
Label all elements in the tooltip according to their own accessibility guidance.
![image] A rich and plain tooltip with all elements matched to accessibility labels.
_The tooltip container should have the **Tooltip** role_
