# TODO

- router - react-router-dom v6
- UI toolkit - material-ui
- styling - JSS & material styles

- Jest testing
- Fetch vs Axios
- state management - redux vs provider
- theming
- responsive design
- various form components
- logs from ui

# Components

- Sidebar
- TopNav
- Footer
- Service Worker
- FileUpload / Drop Zone

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# JSON Schema for validation and form display

The title property serves as label for the adaptive form components.
The description property is set as long description for an adaptive form component.
The default property serves as initial value of an adaptive form field.
The maxLength property is set as maxlength attribute of the text field component.
The minimum, maximum, exclusiveMinimum, and exclusiveMaximum properties are used for Numeric box component.
To support range for DatePicker component additional JSON Schema properties minDate and maxDate are provided..
The minItems and maxItems properties are used to restrict the number of items/fields that may be added or removed from a panel component.
The readOnly property sets the readonly attribute of an adaptive form component.
The required property marks the adaptive form field as mandatory whereas in case of panel(where type is object), the final submitted JSON data has fields with empty value corresponding to that object.
The pattern property is set as the validation pattern (regular expression) in adaptive form.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
