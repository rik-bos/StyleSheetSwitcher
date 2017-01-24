## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

When multiple users share a Mendix application, but custom style is required, it is useful to load a custom stylesheet based on the user. This can be the case in a multi tenant situation.

The microflow logic can depend on the url the client uses to access the application (eg. the Mendix Custom URL). In that case the widget will create an object in which it stores the client url and this will be passed to the microflow.

If you'd like the widget to load your complete theme (and not just some extra stylesheet) you should remove the stylesheet from the theme\index.html and load it within the widget. A loader <div> (see further) may be useful to prevent the page from being rendered without a stylesheet.

## Description

The client url (for development it is possible to distinguise between 127.0.0.1 and localhost) can be added to an object. This object is instantiated by the client. The widget will then call (with or without url object) the microflow. This microflow returns the filename of the needed stylesheet (after the basepath).

![modeler_2016-08-16_10-01-41](https://cloud.githubusercontent.com/assets/9658410/17693099/851c3d9c-639d-11e6-8be9-d4d99387e522.png)

![modeler_2016-08-16_10-01-54](https://cloud.githubusercontent.com/assets/9658410/17693100/851e50a0-639d-11e6-844d-879f2999433b.png)

The widget will start the retrieval of the stylesheets in the base path. The name of the stylesheet will be added to the basepath. Slashes will be added if nessecairy.

Before adding the new stylesheet, it will remove mxui.css from the DOM. After adding the custom stylesheet, it will be added again. The reason for this is that the custom stylesheet is added at the end of the <HEAD> part of the DOM (and thus after mxui.css, which should be at the end of <HEAD>).

It is possible to set a default stylesheet. It will be used if the microflow results null.

However, when the default is different from the custom stylesheet, the widget can remove it (in that case the widget does not add, but replace a stylesheet).

## Loading div

To prevent the page from "being without stylesheet", it can be useful to add a "loading div" to the index.html:

```html
<div id="loader">The application is loaded</div>
```

When the page container is hidden, the page is not shown before the custom style is added.:
```css
#content{
   visibility: hidden;
}
```

The custom stylesheet should contain:
```css
#content{
  visibility: visible;
}
#loader{
  display: none !important;
}
```

## Known Bugs
None.
