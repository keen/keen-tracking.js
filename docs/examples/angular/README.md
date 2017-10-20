# Keen Angular example

This is a full working example that demostrates how to track Keen events in an Angular (4.x) application.

## Running the application

From the ```keen-angular-example``` folder, execute

```sh
$ npm install
$ npm start
```

Point your browser to http://localhost:4200/

## The application structure

There are 3 Angular components:
* App - the main component
* FirstPage - A form
* SecondPage - A dummy page simply to demonstrate tracking Keen events on router changes

## Keen tracking integration

An instance of KeenService is created when the application starts up and Keen is initialized as described in the documentation.

There are 3 methods for recording Keen events.

### Router navigation

```TypeScript
private recordRouterMavigationEvents() {
    this.router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        this.client.recordEvent('pageView', {
          title: document.title
        });
      }
    });
  }
```

This method is called automatically when KeenService is created. Clicking "First Page" and "Second Page" will trigger Router events and pass them on to the "pageView" Keen stream.

### Value selected in the dropdown

```TypeScript
public recordValueSelectedEvent( formName: string, field: string, newValue: string ) {
    this.client.recordEvent('valueSelected', {
      formName,
      field,
      newValue
    });
  }
```

* Stream: valueSelected
* formName - The name of the form, in the example it's always "uiStackSurvey"
* field - The name of the form field, in the example it's always "uiStack"
* newValue - The value, for example "Angular 2+"

### Form field focus

```TypeScript
public recordOnFocusEvent( formName: string, field: string ) {
    this.client.recordEvent('onFormFieldFocus', {
      formName,
      field
    });
  }
```

* Stream: onFormFieldFocus
* formName - The name of the form, in the example it's always "uiStackSurvey"
* field - The name of the form field, in the example it's always "uiStack"

The dropdown on FirstPage shows both how to record an event on focus and when the value has been changed:

```HTML
<mat-select placeholder="Favorite UI stack" 
            (change)=uiStackValueChanged() 
            (focus)="onFocus('uiStack')">
```

## Environments

When running ```$ npm start```, events are not sent to Keen but just logged in the broswer console instead.

To actually track events:

* Set your projectId and writeKey in ```src/environments/environment.prod.ts```
* Run ```$ npm run start.prod```
