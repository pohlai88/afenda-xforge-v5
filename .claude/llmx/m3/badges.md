# Badges

slug: badges · updated: 2026-07-17 · source: m3.material.io

## §Overview

- Can contain labels or numbers

- Two variants: small and large

- Anchor badges inside the icon bounding box, at the upper trailing edge of the icon

- Limit content to four characters, including a **+**

- Keep the default color mapping
![image] 3 icons with badges. 1 is a small dot. 2 is a larger circle with a 1 digit number. 3 is an oval with a 4 digit number.
_- Small badge on a navigation item
- Large badge on a navigation item
- Large badge with max characters on a navigation item_
## Availability & resources
[module: STATUS_TABLE · designSystems/030656e0a1083ef1/components/69586a0d0e3bfa32]
## Differences from M2
- Color: New color mappings and compatibility with dynamic color
![image] Navigation bar showing 4 icons with different badge variants in a bright red color.
_Badges have new color mappings_

## §Specs

![image] 5 aspects of badge anatomy on a navigation bar.
_Navigation bar
- Small badge
- Large badge container
- Large badge label
- Large badge maximum character count container
- Large badge maximum character count label_
![image] 5 aspects of badge anatomy on a navigation rail.
_Navigation rail
- Small badge
- Large badge container
- Large badge label
- Large badge maximum character count container
- Large badge maximum character count label_
## Tokens & specs
Browse the component elements, attributes, tokens, and their values.
[module: TOKEN_TABLE · designSystems/20543ce18892f7d9/components/59a1b3a9a90ca8b3]
```json
{"contextTags":["None","Medium contrast","Default","High contrast","Static","3P","Android","Dark","Light"],"hideSearchField":false,"hideVersionName":true}
```
## Color
Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)
![image] 5 applications of badge color on light and dark theme navigation bars.
_Badge color roles used for light and dark schemes in navigation bar:
- Error
- Error
- On error
- On error
- Error_
![image] 5 applications of badge color on light and dark theme navigation rails.
_Badge color roles used for light and dark schemes in navigation rail:
- Error
- On error
- Error
- On error
- Error_
## Measurements
![image] Annotation of badge sizes, padding, and measurements from the corner of the icon to the badge opposite corner.
_Badge padding and size measurements_
| | Attribute
 | Value

| Small badge shape
 | 3dp corner radius

| Small badge size (HxW)
 | 6dp

| Large badge shape
 | 8dp corner radius

| Large badge one digit size (HxW)
 | 16dp

| Large badge max character count size (HxW)
 | 16x34dp

| Small badge: distance from top trailing icon corner to bottom leading badge corner (HxW)
 | 6x6dp

| Large badge: distance from top trailing icon corner to bottom leading badge corner (HxW)
 | 14x12dp

| Large badge padding between badge and text container
 | 4dp
## Configuration
Different badges are shown on navigation destinations in various states.
![image] Diagram of 3 badge variations shown on navigation destinations in various states.
- Inactive with label - small badge
- Inactive with label - large badge
- Inactive with label - large badge max character count
- Inactive - small badge
- Inactive - large badge
- Inactive - large badge max character count
- Active with label - small badge
- Active with label - large badge
- Active with label - large badge max character count
- Active nav bar no label - small badge
- Active nav bar no label - large badge
- Active nav bar no label - large badge max character count
- Active nav rail no label - small badge
- Active nav rail no label - large badge
- Active nav rail no label - large badge max character count

## §Guidelines

![image] Diagram of 4 badges in different configurations on a navigation bar's destination icons.
_Large badges and a small badge in a navigation bar_
## Usage
Badges are used to indicate a notification, item count, or other information relating to a navigation destination. They are placed on the ending edge of icons, typically within other components.
There are two variants:
- Small badge

- Large badge
![image] Diagram of 4 badges in different configurations on a navigation bar's destination icons.
_Navigation bar with four badges_
A **small badge** is a simple circle, used to indicate an unread notification.  
A **large badge** contains label text communicating item count information.
![image] A small badge is a circle with no characters.
_Small badge_
![image] A large badge holds 4 characters and expands its container's width but not height.
_Large badge_
### With other components
Badges are most commonly used within other components, such as navigation bar, navigation rail, app bars, and tabs.
![image] Navigation bar with 3 icon buttons. 2 icons buttons have badges and 1 doesn't.
_In navigation bars, hide the badge once the destination has been selected_
## Anatomy
![image] Small and large badges on 2 icon buttons.
_- Small badge
- Large badge container
- Large badge label_
## Container
There are two container options for the badge: 
- Small badge with no text

- Large badge with text
![image] A small badge on a navigation item.
_A small badge uses only shape to indicate a status change or new notification_
![image] Number 10 displayed within large badge on a navigation item.
_A large badge displays a number within a container to indicate a quantifiable status change related to a destination_
Badge containers are anchored inside the icon bounding box. As the number count increases for large badges, their width expands, but keeps the same placement.
Badges use a color intended to stand out against labels, icons, and navigation elements. Use the default color mapping to avoid color conflict issues.
![image] Small and large badges on the left side of 2 navigation items in a right-to-left language.
_Change the position of the badge for right-to-left languages_
![image] Small and large badges at random positions on 3 icon buttons on a navigation rail.
_Badges have fixed positions. Don’t change the position of the badge arbitrarily or place the badge over the icon._
![image] Small and large badges in default red color on 3 navigation items.
_Use the default badge color_
![image] Small and large badges in custom colors on 3 navigation items.
_Avoid using custom color roles for the badge container and label text. If custom roles are necessary, make sure they have contrast of at least 3:1._
### Label text
Label large badges with counts or a status. The maximum number of characters within large badge label text is four, including a + to indicate more.
![image] 4 icons with increasing number badges. The badges represent quantities, using a "+" symbol for quantities over 999.
_Large badges with one to four characters_
Use the recommended maximum character count to ensure labels don’t extend beyond the badge container.
![image] 4-digit numbers condensed to a 3-digit badge with "+" to fit the badge container's width.
_Truncate badge labels as needed_
![image] 4-digit and 5-digit number badges on navigation items exceed the badge container's width and get cut off at the edge.
_Don’t let the badge get cut off or collide with another element_
## Placement
![image] Large badge to the right of a navigation rail item.
_Use a large badge to show count information when visual collisions aren’t an issue, such as in a navigation rail_
![image] Small badge on an icon button in an app bar.
_Use a small badge when spaces are tightly constrained, such as app bars. Small badges won’t run into the edge of the screen._
![image] Large badge placed at the end of a tab.
_When an icon with a badge is followed by text or another element, place a large badge at the trailing edge_
![image] Large badge overlapping the icon and text in a tab.
_Avoid using a large badge when it might overlap with a trailing element. Either place it at the trailing edge or use a small badge instead._

## §Accessibility

## Use cases
People should be able to use assistive technology to:
- Understand the dynamic information conveyed in badges, such as counts or labels
- Address badge announcements by selecting corresponding navigation destinations
## Interaction & style
Badges are most commonly used within other components, such as navigation bar, navigation rail, app bars, and tabs.
When a badge is used to indicate an unread notification, the badge gets hidden once it's selected.
![image] An animation of a badge disappearing once it's tapped.
## Visual indicators
Badges use a color intended to stand out against labels, icons, and navigation elements. Use the default color mapping to avoid color conflict issues.
![image] Diagram of large and small badges showing that they need to pass 3 to 1 contrast.
_Badges must use default color with at least 3:1 contrast_
![image] Diagram of large and small badges not passing 3 to 1 contrast.
_Avoid using custom color roles for the badge container and label text. If custom roles are necessary, make sure they have contrast of at least 3:1._
## Labeling elements
The accessibility label for a badge item will be read after its navigation destination. Any numerical badges will have their number read, while non-counting badges will simply announce **New notification**.
![image] Navigation bar highlighting numerical badge.
_Numerical badges will have their number read_
![image] Navigation bar highlighting non-counting badge.
_Non-counting badges will simply announce **New notification**_
