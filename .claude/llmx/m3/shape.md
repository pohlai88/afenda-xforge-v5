# Shape
> The M3 shape system includes original shapes, a corner radius scale, and built-in shape morphing

slug: shape · updated: 2026-07-17 · source: m3.material.io

## §Overview & principles

- Use abstract shapes thoughtfully to add emphasis and decorative flair
- Leverage Material shapes for built-in shape morphing
- Rectangular shapes are fully rounded in all corners by default
- Individual corners can be adjusted to create asymmetrical rectangular shapes
![image] Illustration of range of irregular shapes.
_Abstract shapes can help people express themselves_
## Availability & resources
| | Type
 | Resource
 | Status

| Design
 | [Shape library](http://figma.com/community/file/1035203688168086460/material-3-design-kit) (Figma Design Kit)

 | Available

| Implementation
 | [Jetpack Compose](https://developer.android.com/reference/kotlin/androidx/compose/material3/MaterialShapes) (Shape Library)
 | Available

| [Android Views (MDC-Android)](https://github.com/material-components/material-components-android/blob/master/docs/theming/Shape.md)
 | Available
## M3 Expressive update
**May 2025**
Added 35 **new shapes** and **shape morphing** to [Material Shape Library](https://www.figma.com/community/file/1035203688168086460) (Figma Design Kit) and [Jetpack Compose](https://developer.android.com/reference/kotlin/androidx/compose/material3/MaterialShapes).
Added new shape principles and a refreshed art direction.
Added corner radii tokens:
- Large increased (20dp)
- Extra large increased (32dp)
- Extra extra large (48dp)
- Updated fully rounded corners to use **full**. Previously, this was defined using 50% of the component size.
[More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)
![image] Animation of available Material shapes.
_Overview of Material shapes_
## Shape library
![image] 35 shapes in the shape set.
_M3 has 35 shapes to easily apply to designs_
## Use shapes and text in harmony
Shapes are expressive elements of Material 3 that echo key visual attributes of [M3 typography](/m3/pages/typography/overview/). 
Use shape and type together for products to feel cohesive and polished.
![image] Fonts and mock UI screens showing a wide range of square, round, thin, and thick shapes.
_M3 shapes and Google Sans Flex share roundness visual attributes_
![image] While a person taps water and squeezes a soft cube, a button in the middle responds similarly.
_Shape morphing should respond to user interaction_
## Morph shapes to connect function and feeling
Shapes should morph to improve understanding and add moments of delight. Use shape morph to better communicate:
- Interaction states, like when a button is selected
- Actions in progress, like a friend typing, or a page loading
- Changes in the environment, like sound, temperature, or time of day
Think about how shapes could react to different interactions, such as tapping, swiping, scrolling, releasing, and long pressing.
## Be bold and dare to embrace tension
Tension happens when the shape story changes unexpectedly, such as when contrasting shapes are used. This can be created using both square and rounded shapes, unconventional shapes, and other contrasting elements.
Material historically focused on rounded shapes. However, using sharp shapes, thereby adding tension, creates more dynamic design, one that’s more memorable and expressive.
This tension can be used in many ways, like conveying states, drawing attention to an element, or to improve the visual aesthetic.
![image] Round and square shape side-by-side.
_Create tension by using a combination of round and square shapes_
![image] Use different types of shape in loading indicators to show progress.
_Shapes and motion can communicate actions in progress_
## Shape is versatile, not semantic
Avoid making shapes literal or assigning a specific function or meaning to a single shape.
For example, the loading indicator can be wavy, but the waveform is not a strict symbol of progression. Progress could just as easily be shown using rotating shapes or shape morph. 

Plus, waveforms could be used in other places unrelated to progress, like button containers.
## Use abstract shapes sparingly
Be intentional when using shapes in product UI. Don’t compromise clarity for the sake of visual design.
When incorporating diverse shapes, think about how they fit into the overall design and consider how they balance with the entire composition. Ensure that shapes resonate with the product's narrative. Consider the 'why' behind their inclusion and the value they contribute to the overall user experience.
![image] 8 shapes with icons.
_Shapes without clear meaning behind why they’re different can add more visual clutter than delight_
![image] Shapes morphing to indicate different states.
_Essential shapes can use shape morph to communicate change_
![image] Shapes being applied as masks on photos to make them more interesting.
_Use abstract shapes on imagery and decorative UI_
## Emphasize aesthetic moments with shape
Get creative when using shape in graphics, for photography cropping, personalized avatar masking, and other non-interactive elements.
Decorative moments offer the most flexible and creative uses of shape.
## Shape can be 2.5D
When effectively used, shape and motion can make 2D visuals feel 3D. They provide the illusion of depth and volume, making visuals more eye-catching and natural.
![image] Shapes spinning and a weather icon transforming into the current temperature.
_Apply motion and shape differently on each layer to give it the illusion of depth_

## §Corner radius scale

Material components use a corner radius scale to define all rectangular shapes, such as buttons, carousels, and dialogs.
![image] Illustration of range of shapes.
_M3 defines corner radii using a shape scale. This can be used to create both uniform and asymmetrical shapes._
## Shape tokens
Material has shape corner tokens to define all corners, and corner-value tokens for individual corners. [Learn more about design tokens](/m3/pages/design-tokens/overview)
[module: TOKEN_TYPE_UNSPECIFIED · designSystems/20543ce18892f7d9]
```json
{"tokenSets":["Shape"],"hideSearchField":false,"hideVersionName":true}
```
### Corner radius scale
The Material 3 shape system uses a size-based scale with ten styles. Styles are assigned to components based on the desired amount of roundedness. 
- None - 0dp
- Extra small - 4dp
- Small - 8dp
- Medium - 12dp
- Large - 16dp
- Large increased - 20dp
- Extra large - 28dp
- Extra large increased - 32dp
- Extra extra large - 48dp
- Full - fully rounded corners
[Apply shape styles using tokens](/m3/pages/design-tokens/overview)
![image] 10 corner radii styles.
_Steps on the scale are named for the amount of roundedness applied to the corner_
![image] Components illustrating the old 3-level shape scale.
_M2: Three-level shape scale based on the size of the component container_
![image] Components illustrating the new 10-level shape scale.
_M3: Ten-level shape scale based on the roundedness of shape corners_
## Symmetry
Components can have either symmetric or asymmetric corner shapes. Symmetric shapes have the same values for all corners, while asymmetric shapes can have corners with different values.
Both symmetric and asymmetric shapes use the same 10-step scale.
Asymmetrical shapes are used in M3 components with closely-grouped items, such as menus and split buttons. These are called **inner corners**.
![image] 3 shapes illustrating symmetrical and asymmetrical styles.
_**Inner corner **component tokens always map to individual corner shape tokens_
## Customizing shapes
Generally, products should consistently use the Material 3 shape styles. However, customization is sometimes necessary, and even encouraged, for hero moments or custom components. Shapes can be customized at the **style** or **component** level.
### Style changes
The corner radius shape style, like **medium**, can be customized to be a different size.
This applies the change to all components mapped to that shape style, unless they have an override.
![image] Shapes with different corner radii.
_Customizing the corner size of the **medium** style applies the change to all components using this style, such as cards and small FABs_
### Component changes 
The style of a specific component, such as a button, can be changed by customizing which corner radius shape style it maps to.
For example, by default, buttons are mapped to the **full** corner radius shape style. If your product needs a less rounded shape, remap the token to another style in the shape scale, such as **small** or **medium**.
![image] Components with different corner radii.
_Remapping the shape for a component to a different style applies the change to just that component across the UI_
The shape style family can be customized from **rounded** to **cut**. This makes the corner a straight line instead of curved.  
Add extra padding to avoid cutting off content in information-dense components.   
For example, a large cut corner on a card will clip content and images in the area more than a rounded corner of the same size.
![image] Card with text and full corners.
_Be careful not to apply large or full corners to information-dense components, such as cards_
![image] Carousel with images with rounded corners.
_Shapes can be intentionally rounder to add more visual variety_
![image] Carousel with full rounded shapes.
_Add unexpected moments by switching between square and fully rounded shapes_
### Adjust for optical roundness
When nesting rounded objects, avoid using the same corner radii for both objects. This can make the corners look unbalanced.
Instead, adjust the corner radii to be proportional to each other; this is called optical roundness. To calculate optical roundness:
- Outer radius - padding = inner radius
- For example: 48dp - 14dp = 34dp
![image] 3 parts of corner radii to adjust.
_- Padding
- Outer radius
- Inner radius_
![image] Nested carousel with optical roundness.
_Use different corner radii values for nested components so they have optical roundness_
![image] Nested radii with the same roundness as its container.
_Avoid using the same corner radius value for nested objects_
### Using the shape library
The Material 3 shape library can be used to create more interesting containers. Use the shape library for mostly visual elements. Avoid applying unconventional shapes to text-heavy containers. 
Shapes should be used sparingly to provide a stronger emphasis and moments of delight.
![image] Unexpected shapes in carousel.
_Leverage the Material shape library for moments of delight_

## §Shape morph

The Material shape library supports easy transitioning, or morphing, between shapes. Shape morph is leveraged in the standard button group and loading indicator components.
## Using shape morph
Access to the Material shape library and the shape morph functionality are available through a platform-specific API.

- For Android, use the [Shapes in Compose API](https://developer.android.com/reference/kotlin/androidx/compose/material3/MaterialShapes)
- Web is not currently available
Shape morphing uses the expressive motion scheme by default. This can be switched to the standard motion scheme as needed.
![image] Shapes available in the shape morph API library.
_The Material shape library contains many types of shapes that can all morph seamlessly into each other_
Material uses shape morphing in the standard button group and loading indicator components.
![image] Morphing buttons react to user clicking.
_The standard button group uses shape morph to show interaction_
![image] Loading indicator with shape morph.
_The loading indicator uses shape morph to show progress_
