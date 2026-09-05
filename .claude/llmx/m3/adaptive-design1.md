# Adaptive design
> Adaptive design makes products more usable by responding to device, user, and environmental contexts

slug: adaptive-design1 · updated: 2026-01-14 · source: m3.material.io

## §Tab 1

## What does adaptive mean?
Adaptive design is a collection of techniques that allows an interface to respond or change to contexts like:
- **The user**: Preferences and user settings

- **The device**: Watch, phone, foldable, tablet, desktop, or XR devices

- **Usage**: Screens may dynamically change as the user resizes windows or changes orientation, or when a user switches between devices

Designing adaptive experiences goes beyond customizable properties like color, typography, and shape. Individual components and entire layouts can adapt based on device and user context.
## Conditions
A condition is a signal that determines when and how an app should adapt. The Material adaptive system supports platform, window size, and input modality conditions.
![image] A spatial UI in XR, with a navigation rail orbiter to the left of an email inbox.
_**Device** conditions include full-screen, windowed, and spatialized environments, as well as device states like posture_
![image] App window being resized horizontally.
_**Window size** conditions include window size classes and orientation_
![image] Hand cursor hovering over a card.
_**Input modality **conditions include methods like touch, stylus, peripherals, eye, and hand tracking_
## Layout
The Material adaptive system uses panes and window size classes to organize content and adapt interface layouts.

Panes are the building blocks of layout; a pane is a single destination in the product. For example, in a messaging app, the list of messages is one pane, and a specific conversation thread is another.

As the pane or window resizes—or as someone navigates the product—panes may change size, enter and exit the screen, and reorganize themselves to make the experience more usable or easier to navigate. These patterns are called **adaptive strategies**. Material has three adaptive strategies that create a cohesive experience across window sizes: [show and hide](/m3/pages/applying-layout/pane-layouts/#562b310f-5dff-4349-8a05-a8903450d13e), [levitate](/m3/pages/applying-layout/pane-layouts/#d692ea5e-2dda-4071-a1f6-8c1dc5a82f5d), and [reflow](/m3/pages/applying-layout/pane-layouts/#b281ceac-8abb-4397-b247-48484fb188ac).
![image] App screen presented on mobile, foldable, and tablet.
_Like the panes of glass that make up a window in the real world, panes in Material design are the primary segments of a digital layout, and can change based on context_
## Components
Components can adapt in appearance, placement, and behavior based on factors like:
- Where components are placed in relation to their containers, content, and pane boundaries
- How components use space
- How components enable usage across different device and input types
Most Material components respond using three main strategies: resizing, hiding and showing, and presentation changes.
### Resizing
Components should resize in response to their content and their placement in a layout.

For example, buttons may scale along with their parent container, or hug their contents and maintain a left or right alignment.
![image] A card with a button that spans the full width, and a card with a button that’s left-aligned and hugs its contents.
_Buttons can hug their contents or span their containers based on context_
### Hiding & showing
Components should hide and show information, or collapse and expand to selectively reveal content that best suits the space.

For example, list items may reveal descriptions or other additional information as their parent container scales.
![image] A list on mobile and on tablet. List items show additional text on tablet.
_List items can reveal more text on a tablet_
### Presentation changes
Presentation changes include the orientation of elements and changes to specific properties, like color, type, and shape. 
Components can also change configurations. For example:
- When a window size increases, a FAB can change sizes, like from medium to large

- Navigation bars can change nav items from vertical to horizontal
![image] Extended FAB changing to standard FAB when an app window is made smaller.
_The extended FAB can change to a standard FAB when the app window is made smaller_
## Getting started & resources
Canonical layouts, which address some of the most common layouts across apps, are the recommended starting point for adaptive designs. Learn more about each of the [canonical layouts](https://m3.material.io/foundations/layout/canonical-layouts/overview) in Material guidance, and look at inspirational examples on the [Android Developers site](https://developer.android.com/large-screens/gallery).
