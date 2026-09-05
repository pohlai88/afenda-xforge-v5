# App bars

slug: app-bars · updated: 2026-07-24 · source: m3.material.io

## §Overview

- Focus on describing the current page and provide 1–2 essential actions

- Displays labels and page navigation controls at the top of the page. (Use a toolbar to display page actions)

- Four variants: Search app bar, small, medium flexible, large flexible

- On scroll, apply a fill color to separate from body content

- Can animate on and off screen with another bar of controls, like a row of chips
![image] 4 configurations of app bars stacked vertically to show differences.
_- Search app bar
- Small
- Medium flexible
- Large flexible_
## Availability & resources
[module: STATUS_TABLE · designSystems/030656e0a1083ef1/components/411b03efa2256026]
## M3 Expressive update
**May 2025**
The new **search app bar** supports icons inside and outside the search bar, and centered text. It opens the [search view](/m3/pages/search/overview) component when selected.

The new **medium flexible** and **large flexible** app bars come with significant improvements, and should replace **medium** and **large** app bars, which are no longer recommended. The **small** app bar is updated with the same flexible improvements. 

[More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)
Variants and naming:
- Renamed component from **top app bar** to **app bar**

- Added **search app bar**

- **Medium** and **large** app bars are no longer recommended

- Added **medium flexible** and **large flexible **app bars with:
- Reduced overall height

- Larger title text

- Subtitle

- Left- and center-aligned text options

- Text wrapping

- More flexible elements for imagery and filled buttons

- Added features to **small **app bar:
- Subtitle

- Center-aligned text option

- More flexible elements for imagery and filled buttons
![image] 4 total app bar configurations.
_- Search app bar
- Small
- Medium flexible
- Large flexible_
## Differences from M2
- Color: New color mappings and compatibility with dynamic color
- On scroll: No drop shadow, instead a color fill creates separation from content
- Typography: Larger default text
- Layout: Smaller default height
![image] M2 top app bar with elevation to separate it from main content.
_M2: Elevation and a drop shadow raise the top app bar when content is present underneath_
![image] M3 app bar with subtle color difference from main content.
_M3: On scroll, a color fill overlay separates the app bar from the content beneath_

## §Specs

## Variants
![image] 4 variants of app bars.
_- Search app bar
- Small
- Medium flexible
- Large flexible_
### Baseline variants
The baseline M3 **medium** and **large** app bars are no longer recommended in M3 Expressive, and should be replaced with **medium flexible** and **large flexible** app bars, which are similar visually, but have multi-line support, a shorter height, and can contain a wide variety of elements, like images. [Jump to baseline app bar specs](/m3/pages/app-bars/specs#faec9baf-140f-41dc-8b88-2792e90d9d5d)
![image] 2 baseline app bar variants, medium and large.
_Baseline variants
- Medium

- Large_
| | Variant
 | M3
 | M3 Expressive

| Search app bar
 | --
 | Available

| Small
 | Available
 | Available

| Center-aligned
 | Available
 | Merged into **small**. 
Use centered-text configuration.

| Medium (baseline)
 | Available
 | Not recommended.
Use **medium flexible**

| Medium flexible
 | --
 | Available

| Large (baseline)
 | Available
 | Not recommended.
Use **large flexible**

| Large flexible
 | --
 | Available
## Configurations
### Text alignment
![image] 4 variants of app bars with different left and center aligned text headlines.
_Text labels, including supporting text, can be aligned to the leading edge or centered_
| | Category
 | Configuration
 | M3
 | M3 Expressive

| Text alignment
 | Leading edge (default)
 | Available
 | Available

| Centered
 | --
 | Available
## Tokens & specs
Select a token set to view in the table's menu. App bar token sets are organized into a common token set, and size-specific tokens. [Learn about design tokens](/m3/pages/design-tokens/overview)
[module: TOKEN_TABLE · designSystems/20543ce18892f7d9/components/3ec622835c7987b5]
```json
{"tokenSets":["App bar - Common","App bar - Size - Small","App bar - Size - Medium Flexible","App bar - Size - Large Flexible"],"contextTags":["Static","3P","Android"],"tokenSetOrder":["App bar - Common","App bar - Size - Small","App bar - Size - Medium","App bar - Size - Large","App bar - Size - Medium Flexible","App bar - Size - Large Flexible","[Deprecated] App bar - Top, small","[Deprecated] App bar - Top, medium","[Deprecated] App bar - Top, large","[Deprecated] App bar - Top, center-aligned"],"hideSearchField":false,"hideVersionName":true}
```
### Search component tokens & specs
The default search component tokens are used in the search app bar.
[module: TOKEN_TABLE · designSystems/20543ce18892f7d9/components/07341534518f78d0]
```json
{"contextTags":["None","Medium contrast","Default","High contrast","Static","3P","Android","Dark","Light"],"hideSearchField":false,"hideVersionName":true}
```
## Anatomy
![image] 5 elements of the component.
_- Container
- Leading button
- Trailing elements
- Headline
- Subtitle_
App bars can be customized to include:
- An image or logo
- A subtitle
- A filled icon button
Avoid customizing the size of the heading and subtitle, or adding too many actions.
![image] 3 app bars: 1 with a newspaper logo, 1 with a subtitle, and 1 with a filled icon button.
_The app bar can have different layouts depending on which elements are shown_
### Search
The search app bar can include trailing actions inside and outside the search bar. When the search bar is selected, it should open the search view component.
![image] 5 elements of the search app bar.
_- Container
- Leading icon button
- Hinted search text
- Trailing icon or avatar
- Search container_
![image] 3 layouts of icons in the search app bar.
_- A leading element and a trailing element outside search
- A leading element, a trailing element inside search, and a trailing element outside search
- A leading element and two trailing elements outside search_
### Image 
An image can be placed in the app bar. In small app bars, this can replace the label text.
![image] Graphic replacing text headline content.
_Images can be added to app bars and can replace label text on small app bars_
### Filled trailing icon button
The app bar's trailing icon buttons can be replaced with a single, primary, or tonal filled icon button in default or wide sizes.
![image] App bars configured with filled trailing icons.
_The trailing icons can be configured to be a single filled icon button_
### Subtitle
![image] App bars configured with subtitles below their headlines.
_The medium flexible and large flexible app bars hug the text contents, so they are taller when a subtitle is visible
- Small
- Small with subtitle
- Medium flexible
- Medium flexible with subtitle
- Large flexible
- Large flexible with subtitle_
## Color
Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)
All app bars share the same color roles. On scroll, the container changes color to **surface container**.
![image] 4 color roles of the leading edge app bar in light and dark scheme.
_App bar color roles used for light and dark themes:
- Surface
- On surface
- On surface variant
- On surface
- On surface variant
- Surface container (on scroll)_
![image] 4 color roles of the center-aligned app bar in light and dark scheme.
_Search app bar color roles used for light and dark themes:
- Surface 

- On surface variant

- On surface variant

- On surface variant

- Surface container

- Surface container

- Surface container highest_
### Scroll states
![image] Color roles for app bars when flat and on scroll.
_The app bar changes color when flat or on scroll. The search bar can also change color on scroll.
- Flat
- On scroll_
## Measurements
### Search app bar
![image] Search app bar size and padding measurements.
_Search app bar padding and size measurements_
### Small app bar
![image] Small app bar size and padding measurements.
_Small app bar padding and size measurements_
### Medium flexible app bar
![image] Medium flexible app bar padding and size measurements.
_Medium flexible app bar padding and size measurements_
### Large flexible app bar
![image] Large flexible app bar padding and size measurements
_Large flexible app bar padding and size measurements_
## Baseline app bars
The **medium** and **large** app bars are no longer recommended in M3 Expressive. Use the **medium flexible** and **large flexible** app bars in their place.
![image] 4 elements of medium and large app bars.
_Medium and large app bars have the same elements:
- Container
- Leading button
- Trailing icons
- Headline_
### Tokens & specs
Select a token set to view in the table's menu. Baseline app bar token sets are organized into medium, large, and older baseline token sets. [Learn about design tokens](/m3/pages/design-tokens/overview)
[module: TOKEN_TABLE · designSystems/20543ce18892f7d9/components/3ec622835c7987b5]
```json
{"tokenSets":["App bar - Size - Medium (baseline)","App bar - Size - Large (baseline)","[Deprecated] Top app bar - Small","[Deprecated] Top app bar - Medium","[Deprecated] Top app bar -  Large","[Deprecated] Top app bar - Small, Center-aligned"],"contextTags":["None","Medium contrast","Default","High contrast","Static","3P","Android","Dark","Light"],"hideSearchField":false,"hideVersionName":true}
```
### Color
Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)
![image] 4 color roles of the medium top app bar in light and dark scheme.
_Medium top app bar color roles used for light and dark schemes:
- Surface
- On surface
- On surface
- On surface variant_
### Measurements
#### Medium app bar
![image] Diagram of medium app bar padding and size measurements.
_Medium app bar padding and size measurements_
#### Large app bar
![image] Diagram of large app bar padding and size measurements.
_Large app bar padding and size measurements_

## §Guidelines

![image] 4 app bars with headlines and action icons.
_App bars show information about the page, key actions, and navigation actions like **Back** or **Menu**_
## Usage
Use an app bar to provide content and actions related to the current page, such as page navigation actions, headlines, images, and 1–2 essential actions.
The information and actions in the app bar should be contextual and specific to a page, but can also include global product controls, such as search or notifications.
![image] App bar with navigation icon buttons and a 2-line title.
_App bars provide content and actions related to the current page_
App bars should only have one action, two if necessary. 
The primary action should alter or exit the entire page, like **Send**, **Save**, or **Edit**.
If the product has many actions, place those in a toolbar. Avoid placing an overflow menu in the app bar when possible.
![image] App bar with content below.
_App bars can display one high visibility action to boost its prominence_
To boost visibility of a primary action, change the style of the icon button to filled or tonal, and consider using a wide icon button.  
Avoid using multiple filled or tonal buttons.
![image] App bar with 1 filled button.
_Use a filled or tonal button for important actions_
![image] App bar with 2 filled buttons, side by side.
_Don’t put multiple filled or tonal buttons in the app bar_
The four variants of app bars are:
- **Search app bar**
Use on home pages when search is key to the product. 

- **Small**
Use in dense layouts or when a page is scrolled.

- **Medium flexible**
Use to display a larger headline. It can collapse into a small app bar on scroll.

- **Large flexible**
Use to emphasize the headline of the page.
![image] The 4 app bar variants.
_- Search app bar
- Small
- Medium flexible
- Large flexible_
### Baseline app bars
There are two baseline app bars that are no longer recommended:
- **Medium**
Replace with medium flexible.

- **Large**
Replace with large flexible.
![image] 2 baseline app bars.
_- Medium 
- Large_
## Search app bar
Use a search app bar to provide an emphasized entry-point to open the search view.
![image] A search bar within an app bar.
_Search app bars have a search field instead of heading text_
Search bars should always include the word **Search**. They can use various capitalization styles depending on the product.
- **Search**

- Searching a specific area
Example: **Search inbox**

- Search [Product] 
Example: **Search Photos**
![image] 3 examples of search text in an app bar.
_Use proper capitalization depending on what’s being searched_
### Buttons in search app bar
In addition to a trailing avatar, search app bars can have up to two trailing icons on mobile. 
Trailing icons can be placed inside or outside the search bar.
![image] 2 icons placed in the search bar.
_Put the most used actions on the left and least used on the right_
The leading element of a search app bar can be used for a product’s logo to brand the app’s overall experience. 

This logo can be purely cosmetic, or can trigger an action like returning to the home screen or refreshing it. 
Avoid using a logo to open an expanded navigation rail.
![image] A search app bar with a logo, search bar, and avatar.
_The leading element can be a product logo_
Don’t use more than two trailing icon buttons with an avatar. 

If more actions are needed, place them in a toolbar instead.
![image] 3 icons placed in a search app bar.
_Don’t use three icons and an avatar in a search app bar_
### Large screens
The search app bar dynamically adapts to available width. There should be up to four trailing icons on larger screens.
![image] 4 actions placed in a search app bar on a large screen.
_Increased horizontal space on larger screens allows for up to four trailing icons._
### Alternate color options
By default, search containers in app bars use the **surface container** color to distinguish it from the app background. If the background is darker, use a lighter container color on the search bar, like **surface bright**.
When choosing alternate colors, make sure the search text and container have at least 3:1 contrast for readability.
![image] App bar with a light search container color.
_Search app bars can use different colors, like **surface bright**, for improved contrast with surrounding elements_
## Anatomy
![image] Diagram of app bar layout.
_- Container
- Headline
- Trailing icons
- Subtitle
- Leading button_
### Container
The app bar container holds all information and actions at the top of a screen, including navigation icons, headlines, and buttons. 
Avoid changing the position or shape of the container.
![image] App bar with square corners.
_Use straight corners for app bars_
![image] App bar with curved corners.
_Don’t use curved shapes. This implies that the container can expand upon interaction._
Always use the default height of the app bar, and make it span the full width of the window.
![image] App bar at default height.
_Default heights were chosen to ensure readability of on-screen elements_
![image] App bar with reduced height.
_Don't make an app bar shorter than its default height_
### Adding logos
Image logos can be used in app bars to bolster brand identity or visual appeal. 
The image should be high quality and pertinent, and shouldn’t disrupt the app bar's functionality.
![image] A logo added to an app bar.
_Image logos can replace all text in small app bars, and appear above the text in other app bars_
### Leading button
The leading button should be used for navigating the product. 
It typically is one of the following:
- A menu icon, which opens a modal expanded navigation rail

- A back arrow, which returns to the previous screen
![image] Leading navigation icon aligned on left of app bar
_- Leading **Back** button_
### Headline
The headline can describe:
- The current page
- The current section
- The product
Headline text should be brief enough to easily fit in the app bar. 
In medium flexible and large flexible app bars, the headline can wrap to a second line. 
Don’t truncate the headline text.
![image] App bar headline text set in 2 lines.
_If headline text is long, use a medium flexible or large flexible app bar and wrap the headline to two lines maximum_
![image] Small app bar headline text wrapped on 2 lines.
_Don’t wrap text in a small app bar_
Headlines can be aligned to the leading edge or centered.
The headline’s typography size and style change depending on the app bar variant.
![image] Search, small, medium and large flexible app bars with headline styles.
_Headline typography style for each app bar
- Search: Body large
- Small: Title large
- Medium flexible: Headline medium
- Large flexible: Display small_
### Subtitle
Subtitles can add additional context to a page. 
These can be leading-aligned or center-aligned with the headline text.
![image] Small to large flexible app bars with headline and subtitle styles.
_Subtitle typography style for each app bar:
- Small: Label medium
- Medium flexible: Label large
- Large flexible: Title medium_
### Trailing icon buttons
Up to two icon buttons can be placed after the headline, aligned to the trailing edge of the app bar. Place most-used actions closest to the leading edge.
Avoid using these buttons to open a menu with more actions. If more actions are needed, place them in a toolbar instead.
If changing the icon button color style to filled or tonal, only use one icon button.
![image] 2 icons placed to right of headline, from most to least used.
_Put the most used actions on the left and least used on the right_
Use filled icons when possible for the best visibility. Outlined icons can also be used, particularly for unselected toggle buttons.
![image] App bar with 2 filled icons, “save” and “download.”
_Use filled icons for clear, visible actions_
![image] App bar with 2 outlined icons, “save” and “download.”
_Outlined icons can be used as needed, or when using toggle buttons_
## Adaptive design
Adaptive design allows an interface to respond or change based on context, such as the user, device, and usage. [More on adaptive design](/m3/pages/layout-overview/adaptive-design)
### Resizing
The width of the app bar container responds to the view or device width. 
It should always span 100% of the window width.
![image] App bar resizing to wider view.
_The app bar’s container responds to always fill the window width_
Resizing may cause actions at the trailing edge of the app bar to collapse into an overflow menu at smaller breakpoints. 
These actions become visible again at larger sizes.
![image] Trailing icons in app bar collapse into overflow when screen size shrinks.
_Actions at the trailing edge collapse into an overflow menu_
The search container of the search app bar should fill 100% of the space between leading and trailing app bar elements until it reaches 312dp. Then, it should only grow further to fill 50% of that space.
![image] Search app bar resizing to wider view.
_The search field adapts to the amount of space between other elements in the app bar_
### Presentation
The app bar automatically supports right-to-left (RTL) languages by aligning the layout of elements to the leading and trailing edges of the container. 
This means that in RTL languages, the layout of the app bar is mirrored.
![image] App bar in RTL with Hebrew text.
_The app bar’s layout is mirrored for right-to-left (RTL) languages_
## Behavior
### Scrolling
App bars should initially be the same color as the background, then fill with a contrasting color on scroll to provide visual separation from the background.
The app bar can remain on a page at all times, or can hide and reappear when scrolling.
![image] Scrolling app bar container fills with contrasting color.
_Upon scrolling, an app bar container fills with contrasting color to create a visual separation_
To focus more on body content, consider setting the app bar container to be transparent on scroll. This allows the buttons to float above the content. 
Make sure icon buttons have a container fill. 
Consider using narrow-width icon buttons for actions, like **Back**, to reduce the amount of space they take up.
![image] Medium flexible app bar compresses to transform into transparent small app bar.
_Upon scrolling, an app bar container remains transparent and actions inside become filled icon buttons_
Selecting the search bar should open the search view component.
![image] A search app bar opening the search view component when selected.
_When selected, a search app bar opens a search view_
When scrolled, **medium flexible** and **large flexible** app bars can transform into **small** app bars. They should remain small until the page is scrolled back to the top. Don’t transform app bars into a **search app bar**.
![image] Scrolling top app bar compressing to scroll upwards or downward.
_The app bar can hide when scrolling up and reveal when scrolling down_
![image] Medium app bar compresses to transform into Compact top app bar.
_Medium and large flexible app bars can use the compress effect to transform into small app bars when scrolled_

## §Accessibility

## Use cases
People should be able to do the following using assistive technology:
- Understand what page they’re currently visiting
- Take actions or navigate to a new page destination
- Maintain access to app bar actions when the content is scrolled
## Interaction & style
### Touch
When tapping on an icon button, a touch ripple appears, indicating interaction feedback.
![image] An animation of the user tapping on an action item and the ripple effect being shown.
_Touch: Tap_
### Cursor
When hovered, the hover state provides a visual cue to the user that the element is interactive.
When clicked (in both active and inactive states), a ripple appears to indicate feedback.
![image] A mouse hovering over a button in the app bar, then clicking.
_Cursor: Hover, Click_
### Keyboard or switch
When navigating to an interactive element, a focus indicator appears to show that action can be taken.
When the element is selected, an action is then performed.
![image] An example of how to navigate the app bar using a keyboard.
_Interactive elements should have focus rings_
### Initial focus
Focus should initially land on the leading button, since it’s the first interactive element of the app bar.
![image] The tab button is used to navigate from the first button to the second button in the app bar.
_Use **Tabs** to navigate through interactive items_
![image] The space or enter button activates the second action.
_Use **Space** or **Enter** to activate actions_
## Color
On search app bars, use the default color roles when possible.
- Search container: **surface container**
- Search label: **on surface variant**
On darker backgrounds, search bar containers can use the **surface bright** role to maintain strong visual contrast. 
If mapping to other color roles, make sure the text and container have 3:1 contrast to ensure readability.
![image] A search app bar with default dark text on a light container background.
_Make sure search bars and their labels have at least 3:1 contrast. Use the default colors when possible._
![image] A search app bar with custom light text on a light container background.
_Avoid using custom color roles for the search bar container and search label text. If custom roles are necessary, make sure they have contrast of at least 3:1._
## Keyboard navigation
| Keys | Actions
| Tab | Move focus to the next interactive element
| Space or Enter | Activate the focused element
## Labeling elements
The accessibility label for a title should be the same as the content within the title. If needed, add additional context to the accessibility label to ensure users understand what page they’re on or what content is being shown.
Screen readers will read the UI text followed by the component’s role.
![image] The headline has accessibility role “Title”.
_An app bar’s accessibility label can incorporate its UI text as well as additional context_
Label icon buttons according to their [accessibility guidelines](/m3/pages/icon-buttons/accessibility).
![image] The app bar icon button has the accessibility role “Button”.
_An icon button should be clearly labeled on the action it takes, like **View on map**_
