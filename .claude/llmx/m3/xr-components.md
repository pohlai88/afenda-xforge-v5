# XR components
> Learn how Material 3 Expressive components adapt to extended reality devices 

slug: xr-components · updated: 2026-07-17 · source: m3.material.io

## §Overview

- Leverage depth and space to create believable environments

- Design for comfort to minimize motion sickness and physical strain

- Map interactions, like gaze and gestures, to real-world expectations

- Group UI elements on floating spatial panels

- Provide feedback through spatial audio, haptics, and visual cues
![image] Animation showing a toolbar changing from 2D to 3D.
_A toolbar’s behavior and placement changes from a 2D to a 3D experience_
## Material XR components
The following Material components are adapted for XR:
- [App bars](/m3/pages/xr-components/app-bars)

- [Dialogs](/m3/pages/xr-components/dialogs)

- [Navigation bar](/m3/pages/xr-components/nav-bar)

- [Navigation rail](/m3/pages/xr-components/nav-rail)

- [Toolbars](/m3/pages/xr-components/toolbars)
![image] Side view of an XR dialog showcasing spatial elevation.
_A dialog can be spatially elevated on the Z-axis above spatial panels_

## §App bars

star
Note:
XR guidelines are primarily intended for designers. Find what’s implemented in code in the [design kit](https://www.figma.com/community/file/1035203688168086460).
Extended reality (XR) interfaces have special design requirements, like showing apps in 3D space. Material has an XR app bar with custom specs and guidance. See [XR developer documentation](https://developer.android.com/design/ui/xr/guides/foundations) for more details.
## Variants & configurations
There is one app bar orbiter. It closely aligns with the small app bar. It can be configured to be center-aligned or left-aligned.
![image] Center and left-aligned app bar orbiters.
_- Center-aligned app bar
- Left-aligned app bar_
## Anatomy
![image] Diagrams of app bar orbiters identifying 4 internal elements.
_- Container
- Headline
- Trailing icons
- Leading icon_
## Color & elevation
XR uses color to communicate the elevation of UI elements and orbiters. With [spatial elevation](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-elevation), the app bar displays above the spatial panel on the Z-axis. Elevated app bars can use any of these color options:
![image] 3 versions of app bar elevation color strategy.
_- Surface container
- Surface container high
- Surface container highest_
## Measurements
![image] Diagrams with measurements and padding for app bar orbiters.
_Measurements and padding for app bar orbiters_
## Usage
An app bar can appear in an orbiter for a more immersive experience. Currently, this spatial capability is only available in full space. In home space, use a regular app bar on the same plane as the body content to mimic a 2D experience.
![image] Animation showing an app bar changing from 2D to 3D.
_An app bar’s behavior and placement changes from a 2D to a 3D experience_
## Behavior
### Global context
When placed in global context, the orbiter is centered at the top of the app it controls. 
It stays anchored to the app during layout or content changes. 
This ensures navigation elements are always easy to find and use.
![image] An app bar orbiter placed in global context.
_Global app bar orbiters should be centered and anchored to the top of the app_
### Local context
When placed in local context, the orbiter is centered at the top of the spatial panel it controls. 
It repositions in response to layout or content changes.
![image] An app bar orbiter placed in local context.
_Local app bar orbiters should be centered and anchored to the top of the panel. However, this is less common, so make sure that it contains actions that only affect its anchored panel._
### Additional app bars
In most cases, apps should only have one app bar orbiter, placed in global context.
![image] An app switches between 1 and 2 app bar orbiters.
_Limit the use of multiple app bars to rare cases when additional spatialization improves usability_
## Placement
### Offset & inset positioning
In full space, an app bar orbiter can be positioned:
- Offset 20dp from the spatial panel

- Inset 12dp, overlapping spatial panel without obstructing content
![image] App bar orbiter with offset positioning.
_An app bar orbiter with a 20dp offset creates visual separation from the spatial panel_
![image] App bar orbiter with inset positioning that obstructs content..
_Don’t overlap the app bar orbiter and spatial panel more than 12dp_
### Horizontal alignment
![image] An app bar orbiter placed within the bounds of its spatial panel.
_Always align the app bar orbiter within the bounds of nearby spatial panels_
![image] An app bar orbiter that extends beyond the width of its spatial panel.
_The app bar orbiter shouldn’t exceed the width of adjacent spatial panels_
### Spatial panel alignment
By default, app bar orbiters are center-aligned to the spatial panel. Their width and placement can be adjusted to accommodate specific user needs, such as improved ergonomics or [right-to-left (RTL) languages](/m3/pages/bidirectionality-rtl).
![image] App bar orbiter alignment options in relation to spatial panels: left, center, and right-aligned.
_App bar orbiters can align to the center, left, or right of the spatial panel_
### Width boundaries
An app bar orbiter’s width should adjust to stay in a person’s [field of view](https://developer.android.com/design/ui/xr/guides/spatial-ui#where-place). 
This makes crucial navigation elements easy to find.
![image] An app bar orbiter with a width that fits in a person’s field of view.
_Adjust the width of the app bar orbiter to fit in a person’s field of view_
It’s not recommended to increase the width of an app bar orbiter beyond a person’s natural [field of view](https://developer.android.com/design/ui/xr/guides/spatial-ui#where-place). 
This creates a visual imbalance and makes it difficult to find navigation elements.
![image] An app bar orbiter that exceeds the panel’s width and a person’s field of view.
_Avoid expanding the app bar orbiter beyond the adjacent panel’s width and a person’s field of view_
### Adaptable width
When placed in a local context, an app bar orbiter can expand to the width of its adjacent spatial panel.   
Be sure the orbiter stays in a person’s field of view, and test for usability.
![image] 2 app bar orbiters with the same width as their adjacent spatial panels.
_Use caution before expanding the app bar’s width to match its spatial panel. The orbiter may not fit in a person’s primary field of view._
## Accessibility considerations
[XR accessibility](/m3/pages/xr-design/accessibility) guidelines are still evolving. XR app bars should follow applicable Material [app bar accessibility standards](/m3/pages/app-bars/accessibility).

## §Dialogs

star
Note:
XR guidelines are primarily intended for designers. Find what’s implemented in code in the [design kit](https://www.figma.com/community/file/1035203688168086460).
Extended reality (XR) introduces spatial capabilities, such as using depth to make dialogs stand out from the background. Currently, [spatial dialogs](https://www.figma.com/community/file/1035203688168086460) are only available in full space. For home space, follow Material’s general [dialog guidance](/m3/pages/dialogs/overview).
## Color & elevation
XR uses color roles to communicate the elevation of UI elements. Dialogs can use two color options: **surface container high** or **surface container highest**.
star
Note:
Color and elevation for spatial dialogs aren’t available in Jetpack Compose yet. These need to be customized manually.
![image] 2 spatially elevated dialogs with surface-container-high and surface-container-highest color roles.
_- Surface container high
- Surface container highest_
For effective visual hierarchy, a dialog should be the most prominent element. 
Add a scrim behind a dialog to improve its visibility. Scrims prevent other content from being selected until the dialog action is complete.
![image] Dialog with surface-container-highest color and a scrim.
_Make sure a spatial dialog’s color is higher than all other UI elements, and use a scrim_
The dialog should have the highest elevation in the product.
For example, if the dialog is **surface container high**, don’t use **surface container highest** for any other elements.
![image] Dialog with surface-container-high color and no scrim. An orbiter is at a higher elevation than the dialog.
_If a dialog’s color is **surface container high**, don’t use **surface container highest** for any other element_
## Usage
Only use [basic dialogs](/m3/pages/dialogs/guidelines#97ac3858-3932-4084-ae8e-73e42b7cb752) in XR. This keeps the required action in the person’s [field of view](https://developer.android.com/design/ui/xr/guides/spatial-ui#where-place).
![image] Basic dialog in XR.
_A basic dialog elevated above an app in home space_
![image] Full-screen dialog in XR.
_Avoid using full-screen dialogs in XR. Required actions could appear beyond a person’s field of view._
## Spatial dialogs
In full space, dialogs can be elevated spatially via [overrides](https://developer.android.com/develop/xr/jetpack-xr-sdk/material-design#use-enablexrcomponentoverrides). This helps dialogs stand out from their background in XR.
![image] Side view of basic dialog showcasing spatial elevation.
_Side view of a basic dialog with spatial elevation in full space_
## Behavior
### Effect
The spatial dialog should scale uniformly. It also fades in when appearing, and fades out when disappearing. 
The dialog's scrim only fades in and out.
![image] A direct view of a spatial dialog appearing and disappearing.
_Front view of a spatial dialog in motion in full space_
### Movement
When activated, the spatial dialog rises from the app to the highest resting level on the Z-axis. 
When the action is complete, it returns to a normal resting level.
The dialog's scrim stays at the app content level at all times.
To prevent motion sickness, use [standard easing](/m3/pages/motion-easing-and-duration/tokens-specs#601d5552-a6e6-4d74-9886-ff8f24b9ec35) and [long duration](/m3/pages/motion-easing-and-duration/tokens-specs#48bf653e-46f9-48f5-87e0-eaf8ea3fe716) motion tokens.
![image] A spatial dialog elevating on the Z-axis, as seen from a side angle.
_Side view of a spatial dialog in motion in full space_
## Placement
Consider factors like field of view, viewing distance, and possible interactions when deciding where to place dialogs in XR.

A dialog’s placement can be adjusted to accommodate specific needs, such as improved ergonomics or [right-to-left (RTL) languages](/m3/pages/bidirectionality-rtl).
### Elevation: Highest resting level
Display spatial dialogs at the **highest resting level**. When setting the depth value of the highest resting level, make sure the elevated dialog is at a comfortable viewing distance from the person. [More on spatial elevation](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-elevation)
![image] An animated side view of a dialog moving from the lowest to the highest resting level.
_A spatial dialog moves to the highest resting level in full space_
### Center spatial dialogs in field of view
Spatial dialogs should be centered in a person’s [field of view](https://developer.android.com/design/ui/xr/guides/spatial-ui#where-place). If the dialog **can’t** track head movements, position it in the center of the app’s content. 
If the dialog **can** track head movements, configure it with a lazy follow behavior. This keeps the dialog anchored to the center of a person’s field of view until an action is taken.
![image] A dialog follows a person’s head movements, remaining centered in their field of view.
_A dialog in full space stays centered in a person’s field of view_
## Accessibility considerations
[XR accessibility](/m3/pages/xr-design/accessibility) guidelines are still evolving. Spatial dialogs should follow applicable Material [dialog accessibility standards](/m3/pages/dialogs/accessibility).

## §Nav bar

star
Note:
XR guidelines are primarily intended for designers. Find what’s implemented in code in the [design kit](https://www.figma.com/community/file/1035203688168086460).
Extended reality (XR) interfaces have special design requirements, like showing apps in 3D space. Material has an XR navigation bar with custom specs and guidance. See [XR developer documentation](http://developer.android.com/design/ui/xr/guides/foundations) for more details.
## Anatomy
![image] Diagram of navigation bar orbiter identifying 7 internal elements of the component.
_- Container
- Icon
- Active indicator 
- Small badge (optional)
- Large badge (optional)
- Large badge label (optional)
- Label text_
## Color & elevation
On XR, color is used to highlight elevated UI elements and orbiters. With [spatial elevation](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-elevation), the navigation bar displays above the spatial panel, on the Z-axis. Color communicates elevation on UI elements and orbiters. Elevated nav bars can use any of these color options:
![image] 4 versions of elevation color strategy.
_- Surface container
- Surface container high
- Surface container highest
- Tertiary container_
## Measurements
![image] Measurements and padding for navigation bar orbiter.
_Navigation bar orbiter padding and measurements_
## Usage
In full space, a navigation bar can appear in an orbiter for a more immersive experience. Currently, spatial capabilities, such as orbiters, are only available in full space. In home space, use a regular navigation bar on the same plane as the body content to mimic a 2D experience.
![image] Interface showcasing navigation bar behavior and placement when transitioning from a 2D to 3D experience.
_Navigation bar behavior and placement changing when going from a 2D to a 3D experience_
## Behavior
### Global context
When placed in global context, the navigation bar orbiter is centered at the bottom of the app it controls. It stays anchored to the app during layout or content changes. This ensures navigation elements are easy to find and use.
![image] A navigation bar orbiter placed in global context.
_A navigation bar orbiter centered and anchored to the bottom of the app_
### Local context
When placed in local context, the navigation bar orbiter is centered at the bottom of the spatial panel it controls. It repositions in response to layout or content changes.
![image] A navigation bar orbiter placed in local context.
_Use caution before placing a navigation bar in local context. If it contains navigation elements that affect the overall app, a navigation bar orbiter should be placed in global context._
## Placement
### Navigation context
The position of the navigation bar orbiter should communicate its navigational context:
- Use **offset positioning** for global actions that affect the overall app experience

- Use **inset positioning** for local actions that are specific to a spatial panel

A navigation bar orbiter can either overlap or be positioned adjacent to spatial panels with a 20dp margin for visual separation.
![image] Navigation bar orbiter offset and inset positioning.
_Position the navigation bar orbiter to reflect context: offset for global actions, inset for spatial panel-specific actions_
### Inset positioning
Don’t obstruct content. To ensure a balanced and uncluttered layout, a navigation bar orbiter should overlap spatial panels by 12dp and no more than half their height.
![image] Navigation bar orbiter inset positioning beyond the 12dp recommendation.
_Avoid overlapping an inset a navigation bar orbiter by more than half its height_
### Horizontal alignment
The navigation bar orbiter placement shouldn't exceed the width of adjacent spatial panels.
![image] Nav bar orbiter placement that exceeds the width of its spatial panel.
_The navigation bar orbiter shouldn’t exceed the width of the spatial panel_
### Spatial panel alignment
A navigation bar orbiter should always be placed at the bottom of a spatial panel and within the immediate field of view (FOV).
Their placement can be adjusted to accommodate specific needs, such as improved ergonomics or [right-to-left (RTL) languages](/m3/pages/bidirectionality-rtl).

Avoid placing the navigation bar orbiter at the top of a spatial panel, as this area is typically reserved for app bar orbiters or other critical UI elements.
![image] Nav bar orbiter incorrectly placed above a spatial panel.
_Don't position a navigation bar orbiter at the top of a spatial panel. Position it at the bottom in the field of view to maintain usability and minimize interaction effort._
## Accessibility considerations
XR navigation bars should follow applicable Material [nav bar accessibility standards](/m3/pages/navigation-bar/accessibility). [More on XR accessibility](/m3/pages/xr-design/accessibility)

## §Nav rail

star
Note:
XR guidelines are primarily intended for designers. Find what’s implemented in code in the [design kit](https://www.figma.com/community/file/1035203688168086460).
Extended reality (XR) interfaces have special design requirements, like showing apps in 3D space. Material has an XR navigation rail with custom specs and guidance. See [XR developer documentation](http://developer.android.com/design/ui/xr/guides/foundations) for more details.
## Variants
There are two variants of navigation rail orbiters: the contained FAB and spatialized FAB navigation rails.
![image] Navigation bar orbiters with a contained FAB and a spatialized FAB.
_- Contained FAB rail
- Spatialized FAB rail_
## Anatomy
![image] Diagram of navigation rail orbiter identifying 9 internal elements of the component.
_- Container
- Active indicator
- Large badge (optional)
- Badge (optional)
- Large badge label (optional)
- Label text
- Icon
- Embedded or spatialized FAB (optional)
- Menu icon (optional)_
## Color & elevation
On XR, color is used to highlight elevated UI elements and orbiters. With [spatial elevation](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-elevation), the navigation bar displays above the [spatial panel](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-panels), on the Z-axis. Color communicates elevation on UI elements and orbiters. Elevated nav rails can use any of these color options:
![image] 4 versions of elevation color strategy.
_- Surface container with tertiary FAB
- Surface container high with tertiary fixed dim FAB
- Surface container highest with tertiary fixed dim FAB
- Tertiary container with primary FAB_
## Measurements
![image] Measurements and padding for navigation rail orbiter with contained FAB.
_Navigation rail orbiter padding and measurements with contained FAB_
![image] Measurements and padding for navigation rail orbiter with spatialized FAB.
_Navigation rail orbiter padding and measurements with spatialized FAB_
## Usage
In full space, a navigation rail can appear in an orbiter for a more immersive experience. Currently, spatial capabilities, such as orbiters, are only available in full space. In home space, use a regular navigation rail on the same plane as the body content to mimic a 2D experience.
![image] Interface showcasing navigation rail behavior and placement when transitioning from a 2D to 3D experience.
_Navigation rail orbiter behavior and placement changing when going from a 2D to a 3D experience_
## Behavior
### Global context
Intended for global navigation, a nav rail orbiter should be centered along the left or right edge of the app it controls. It stays anchored to the app during layout or content changes to ensure controls are easy to find.
![image] A navigation rail orbiter placed in global context.
_A navigation rail orbiter should be placed in global context, centered and anchored to the left or right of the app_
### Local context
Don’t place a navigation rail orbiter in local context or [between spatial panels](/m3/pages/xr-components/nav-rail#d965ae72-bd1b-45a9-b4d3-d1d542e72087). Local placement can make controls hard to find. Nav rails are designed for app-level navigation, so should only use the global context.
![image] A navigation rail orbiter placed in local context.
_Avoid placing a navigation rail orbiter in local context. It can be hard to find if placed between two spatial panels._
## Placement
### Navigation context
The position of the navigation rail orbiter should communicate its navigational context:
- Use **offset positioning** for global actions that affect the overall app experience

- Use **inset positioning** for local actions that are specific to a spatial panel

A navigation rail orbiter can either overlap or be positioned adjacent to spatial panels with a 20dp margin for visual separation.
![image] Navigation rail orbiter offset and inset positioning.
_Position the navigation rail orbiter to reflect context: offset for global actions, inset for spatial panel-specific actions_
### Inset positioning
Don’t obstruct content. To ensure a balanced and uncluttered layout, a navigation rail orbiter should overlap spatial panels by 12dp and no more than half their width.
![image] Nav rail orbiter overlapping content by more than half its width.
_Avoid overlapping an inset navigation rail orbiter by more than half its width_
### Vertical alignment
A navigation rail orbiter can be aligned to the top, middle, or center of spatialized panels, providing different levels of visual prominence and accessibility.

Align the navigation rail orbiter based on the specific design and user experience goals for the application.
![image] Nav rail orbiter positioning moving from the top, to middle, to center of spatialized panels.
_Align the navigation rail orbiter at the top or center of spatialized panels_
The navigation rail orbiter placement shouldn't exceed the height of adjacent spatial panels.
![image] A nav rail orbiter positioning above its spatial panel.
_The navigation rail orbiter shouldn’t exceed the height of the spatial panel_
### Spatial panel alignment
Avoid placing a navigation rail orbiter between spatial panels. This negatively affects the interface structure.
Navigation rail placement can be adjusted to accommodate specific needs, such as improved ergonomics or [right-to-left (RTL) languages](/m3/pages/bidirectionality-rtl).

For layouts that span more than two spatial panels, consider using a [navigation bar orbiter](/m3/pages/xr-components/nav-bar).
![image] A nav rail orbiter incorrectly positioned between spatial panels.
_Don't place a navigation rail orbiter between spatial panels_
## Spatialized FAB
There are two variants of navigation rail orbiters with different FAB treatments:
- **Contained FAB rail:** A contained FAB within the rail. This offers a compact and familiar layout.

- **Spatialized FAB rail:** The FAB becomes an orbiter of its own and is placed outside the navigation rail orbiter. Use this for higher emphasis and a distinct spatial effect.

Use the spatialized FAB rail to emphasize key actions and leverage XR hierarchy. Use the contained FAB rail to be more subtle, and align the experience with the baseline navigation bar.
![image] Interface showing the difference between a navigation rail orbiter with a contained FAB and spatialized FAB.
_Choose between a navigation rail orbiter with a contained FAB or a spatialized FAB_
To maintain visual association, place the spatialized FAB in close proximity to the navigation rail orbiter. Material recommends a 20dp margin.

The spatialized FAB can be placed above or below the navigation rail orbiter.
![image] Spatialized FAB positioned close to the navigation rail orbiter.
_Position the spatialized FAB close to the navigation rail orbiter_
While the spatialized FAB and navigation rail orbiter are typically positioned together, their placement is adaptable.
![image] Spatialized FAB positioned with excessive spacing between itself and the navigation rail orbiter.
_Use caution when positioning spatialized FABs. Keep them within the height of adjacent spatial panels_
## Accessibility considerations
[XR accessibility](/m3/pages/xr-design/accessibility) guidelines are still evolving. XR navigation rails should follow applicable Material [nav rail accessibility standards](/m3/pages/navigation-rail/accessibility).

## §Toolbars

star
Note:
XR guidelines are primarily intended for designers. Find what’s implemented in code in the [design kit](https://www.figma.com/community/file/1035203688168086460).
Extended reality (XR) interfaces have special design requirements, like showing apps in 3D space. Material has an XR toolbar with custom specs and guidance. Read [XR developer documentation](https://developer.android.com/design/ui/xr/guides/foundations) for more details.
## Variants
There is one toolbar orbiter. It closely aligns with the floating toolbar. It can be configured to be horizontal or vertical. [Go to XR toolbar API reference](https://developer.android.com/reference/kotlin/androidx/xr/compose/material3/package-summary#HorizontalFloatingToolbar(kotlin.Boolean,androidx.compose.ui.Modifier,androidx.compose.material3.FloatingToolbarColors,androidx.compose.foundation.layout.PaddingValues,androidx.compose.material3.FloatingToolbarScrollBehavior,kotlin.Function1,kotlin.Function1,kotlin.Function1))
![image] Horizontal and vertical toolbar orbiters.
_- Horizontal floating toolbar
- Vertical floating toolbar_
## Anatomy
![image] 2 elements of a toolbar orbiter: container and placed components.
_- Container
- Placed components_
## Color & elevation
XR uses color to communicate the elevation of UI elements and orbiters. With [spatial elevation](https://developer.android.com/design/ui/xr/guides/spatial-ui#spatial-elevation), the toolbar displays above the spatial panel on the Z-axis. Elevated toolbars can use any of these color options:
![image] 4 versions of toolbar elevation color strategy.
_- Surface container
- Surface container high
- Surface container highest
- Tertiary container_
## Measurements
![image] Diagram with measurements for toolbar orbiters.
_Measurements for toolbar orbiters_
![image] Diagram with 12dp padding for toolbar orbiters.
_Padding for toolbar orbiters_
## Usage
A toolbar can appear in an orbiter for a more immersive experience. Currently, this spatial capability is only available in full space. In home space, use a regular toolbar on the same plane as the body content to mimic a 2D experience.
![image] Animation showing a toolbar changing from 2D to 3D.
_A toolbar’s behavior and placement changes from a 2D to a 3D experience_
## Behavior
### Local context (recommended)
When placed in local context, the toolbar orbiter is centered at the bottom of the spatial panel it controls. 
It repositions in response to layout or content changes.
![image] A toolbar orbiter placed in local context.
_In most cases, toolbars should be placed in local context. The orbiter is centered and anchored to the bottom of the panel it controls._
### Global context
When placed in global context, the toolbar orbiter is centered at the bottom of the app. 
It stays anchored to the app during layout or content changes.
![image] A toolbar orbiter placed in global context.
_In global context, toolbar orbiters are centered and anchored to the bottom of the app. This use case is less common, as toolbars usually contain actions that control a specific panel._
### Expand & collapse
Toolbar orbiters with more than five items can expand and collapse to reveal or hide additional content.
When a toolbar orbiter expands, it stays within the bounds of the adjacent spatial panel.
Alternatively, more complex toolbars can be split into multiple toolbars.
![image] A spatial panel with a Google document has a toolbar orbiter that expands from 5 to 10 items.
_Toolbar orbiters can expand to reveal additional content, but should stay within the bounds of the adjacent spatial panel_
### Additional toolbars
In some cases, full space apps can have more than one toolbar orbiter, placed in either global or local context.
![image] An app switches between 1 and 2 toolbar orbiters.
_Limit the use of multiple toolbars to rare cases when additional spatialization improves usability_
## Placement
### Offset & inset positioning
In full space, a toolbar orbiter can be positioned adjacent to or overlap a spatial panel.
![image] Toolbar orbiter with offset positioning.
_The recommended toolbar orbiter position from the spatial panel is: 
- Offset by 20dp or 
- Inset by 12dp_
![image] Toolbar orbiter with inset positioning above 12dp that obstructs content on the spatial panel.
_To prevent content obstruction, don’t overlap the toolbar orbiter and spatial panel above 12dp_
### Horizontal alignment
![image] A horizontal toolbar orbiter placed within the bounds of its spatial panel.
_Always align the toolbar orbiter within the horizontal bounds of nearby spatial panels_
![image] A horizontal toolbar orbiter that extends beyond the width of its spatial panel.
_The toolbar orbiter shouldn’t exceed the width of adjacent spatial panels_
### Vertical alignment
![image] A vertical toolbar orbiter placed within the bounds of its spatial panel.
_Always align the toolbar orbiter within the vertical bounds of nearby spatial panels_
![image] A vertical toolbar orbiter that extends beyond the height of its spatial panel.
_The toolbar orbiter shouldn’t exceed the height of adjacent spatial panels_
### Spatial panel alignment
By default, toolbar orbiters are center-aligned to the spatial panel. Their placement can be adjusted to accommodate specific user needs, such as improved ergonomics or [right-to-left (RTL) languages](/m3/pages/bidirectionality-rtl).
![image] Toolbar orbiter alignment options in relation to spatial panels.
_Depending on the configuration (horizontal or vertical) of the toolbar orbiter, it can align to the center, left, right, top, or bottom of a spatial panel_
Avoid placing a vertical toolbar orbiter between spatial panels. 

This negatively affects the interface structure and can make it difficult to find.
![image] A vertical toolbar orbiter is placed between 2 spatial panels.
_Don't place a vertical toolbar orbiter between spatial panels_
## Accessibility considerations
[XR accessibility](/m3/pages/xr-design/accessibility) guidelines are still evolving. XR toolbars should follow applicable Material [toolbar accessibility standards](/m3/pages/toolbars/accessibility).
