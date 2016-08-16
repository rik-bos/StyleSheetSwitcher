## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

When multiple users share a Mendix application, but custom style is required, it is useful to load a custom stylesheet based on the user. This can be the case in a multi tenant situation.

The microflow logic can depend on the url the client uses to access the application (eg. the Mendix Custom URL). In that case the widget will create an object in which it stores the client url and this will be passed to the microflow.
## Description

The widget will start the retrieval of the stylesheets in the base path. The name of the stylesheet will be added to the basepath. Slashes will be added if nessecairy.

Before adding the new stylesheet, it will remove mxui.css from the DOM. After adding the custom stylesheet, it will be added again. The reason for this is that the custom stylesheet is added at the end of the <HEAD> part of the DOM (and thus after mxui.css, which should be at the end of <HEAD>).

## Known Bugs
