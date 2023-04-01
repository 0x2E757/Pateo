# Pateo

Lightweight library for react with native promise wrapper that can be cancelled ([PromiseExt](https://github.com/0x2E757/PromiseExt)), variable wrappers ([Wrappers](https://github.com/0x2E757/Wrappers)) and interactive forms.

TypeScript code transpiled to ES2015 JavaScript.

## Install

```bash
npm i pateo
```

## Usage

First of all, pateo contains exports for the PromiseExt and wrapper classes. You can check the [PromiseExt](https://github.com/0x2E757/PromiseExt) and [Wrappers](https://github.com/0x2E757/Wrappers) repositories for their readmes to get the basics.

Secondly, pateo has helper functions for integrating wrappers into a React project and a form class for building interactive forms.

### Examples on StackBlitz

* [Counter example using wrapper](https://stackblitz.com/edit/pateo-example-rsh9xv?file=src%2Fwrappers.ts,src%2Fcounter.tsx)
* [Global form and useSubscribable](https://stackblitz.com/edit/pateo-example-ynur8o?file=src%2Fformreader.tsx,src%2Fglobalform.tsx)
* [Form custom field components](https://stackblitz.com/edit/pateo-example-n8quoy?file=src%2Fexampleform.tsx)
* [Form submission errors](https://stackblitz.com/edit/pateo-example-zvgyea?file=src%2Fexampleform.tsx)

You can find explanations to each example further in this readme.

### How to import

Everything in master object:
```typescript
import Pateo from "pateo";
```

Or exact things you want to use:
```typescript
import { PromiseExt, StaticWrapper, useWrapper, ... } from "pateo";
```

### Counter example using wrapper

Let's make classic counter example.

Create `wrappers.ts` file for storing your wrappers:
```typescript
import { StaticWrapper } from "pateo";

export const counter = new StaticWrapper(0);
```

Create `counter.tsx` with counter components:
```typescript
import { useWrapper } from "pateo";
import * as w from "./wrappers";

export function CounterValue() {
    const [counter] = useWrapper(w.counter);
    return <div>Counter {counter}</div>;
}

export function CounterIncrementer() {
    const [counter, setCounter] = useWrapper(w.counter);
    return <button onClick={() => setCounter(counter + 1)}>Increment</button>;
}
```

Now you can render `<CounterValue />` and `<CounterIncrementer />` in any parts of your app and they both will work with the same value.

You can also modify wrapper value using wrapper helpers (read more in the [Wrappers](https://github.com/0x2E757/Wrappers) repository readme):
```typescript
export function CounterIncrementer() {
    return <button onClick={() => w.counter.inc(1)}>Increment</button>;
}
```

### Form basic example

There are multiple ways to use `Form` class in you application. Let's get started with local form that exists just in terms of component lifecycle.

Create `exampleform.tsx` with `ExampleForm` component:
```typescript
import { useForm } from "pateo";

export function ExampleForm() {
    
    const form = useForm();

    return (
        <form.Form>
            <form.Input name="username" />
            <form.Input name="password" type="password" />
            <form.Submit value="Submit!" />
        </form.Form>
    );

}
```

Using `Form` component isn't necessary, but is preferred for proper HTML structure. `Submit` component automatically performs form submit when gets clicked. Fill form inputs (or don't) and click submit button. You will see console warning for unhandled submit with submitted values. Also you will notice that form name is random guid. 

We can leave form name random, or we can set it like that:
```typescript
const form = useForm("awesome-form");
```

Form values can be submitted manually as well using `submit` method:
```typescript
return (
    <form.Form>
        <form.Input name="username" />
        <form.Input name="password" type="password" />
        <button type="button" onClick={() => form.submit()}>Button</button>
    </form.Form>
);
```

There are multiple ways to set submit event callback:
```typescript
const form = useForm("awesome-form");

form.onSubmit = (values) => {
    console.log("Form submitted:", values);
}

return (
    <form.Form>
        <form.Input name="username" />
        <form.Input name="password" type="password" />
        <button type="button" onClick={() => form.submit()}>Button</button>
    </form.Form>
);
```
```typescript
const form = useForm("awesome-form");

const onSubmit = (values: any) => {
    console.log("Form submitted:", values);
}

return (
    <form.Form onSubmit={onSubmit}>
        <form.Input name="username" />
        <form.Input name="password" type="password" />
        <button type="button" onClick={() => form.submit()}>Button</button>
    </form.Form>
);
```
```typescript
const form = useForm("awesome-form");

const onSubmit = (values: any) => {
    console.log("Form submitted:", values);
}

return (
    <form.Form>
        <form.Input name="username" />
        <form.Input name="password" type="password" />
        <button type="button" onClick={() => form.submit(onSubmit)}>Button</button>
    </form.Form>
);
```

### Global form and useSubscribable

Forms can also exist outside of component rendered by, being "global". For example it can be useful if we want form values to persist between form components remounting. In that case we create forms same as wrappers.

Create `forms.ts`:
```typescript
import { Form } from "pateo";

export const myForm = new Form("global-myForm");
```

Create `formreader.tsx`:
```typescript
import { useSubscribable } from "pateo";
import * as f from "./forms";

export function FormReader() {

    const formValues = useSubscribable(f.myForm, f.myForm.getValues());

    return (
        <pre>
            {JSON.stringify(formValues, undefined, 4)}
        </pre>
    );

}
```

Create `globalform.tsx`:
```typescript
import * as f from "./forms";

export function GlobalForm() {
    return (
        <f.myForm.Form>
            <f.myForm.Input name="username" />
            <f.myForm.Input name="password" type="password" />
            <f.myForm.Submit value="Submit!" />
        </f.myForm.Form>
    );
}
```

In the `FormReader` component we're using `useSubscribable` hook. It takes two argument, subscribable object (must contains `subscribe` and `unsubscribe` methods similar to wrappers) and initial value. This hook can be used with any kind of objects, not just forms.

### Form validation

Form field support validation. Let's make simple example:
```typescript
import { useForm } from "pateo";

function required(value: any) {
    if (!value) return "Field is required";
}

export function ExampleForm() {

    const form = useForm("awesome-form");

    return (
        <form.Form>
            <form.Input name="username" validate={required} />
            <form.Input name="password" type="password" validate={[required]} />
            <form.Submit value="Submit" />
        </form.Form>
    );

}
```

Now when we're trying to submit form will ensure that every field value is valid and only then proceed submitting. The `validate` prop can be array of functions so the field will have multiple different validators. Field being considered as valid if all validation functions returned `undefined`.

### Form custom field components

Now let's take a loot at custom form fields:
```typescript
import { Field, useForm } from "pateo";

function required(value: any) {
    if (!value) return "Field is required";
}

function ExampleField({ field, ...props }: { field: Field }) {
    return (
        <input {...props} {...field.inputProps} />
    );
}

export function ExampleForm() {

    const form = useForm("awesome-form");

    return (
        <form.Form>
            <form.Field 
                component={ExampleField}
                name="username"
                validate={required}
            />
            <form.Field
                component={ExampleField}
                name="password"
                type="password"
                validate={required}
            />
            <form.Submit value="Submit" />
        </form.Form>
    );

}
```

Component passed to `Field` will received all props passed to `Field` extended by additional `field` prop, that contains form's field object. This object can be used for creating various functionality. The base thing we want to use is `field.inputProps` property, which contains `value`, `onFocus`, `onChange` and `onBlur` props. This example also is using validation, but user can't see any errors. Let's show them!

```typescript
function ExampleField({ field, ...props }: { field: Field }) {
    return (
        <div>
            <input {...props} {...field.inputProps} />
            {field.errors.map((error, index) => (
                <div key={index}>{error}</div>
            ))}
        </div>
    );
}
```

Now every validation errors will be displayed with the input. But the problem is that erorrs are displayed even before user typed anything in field. Let's add some conditions:
```typescript
return (
    <div>
        <input {...props} {...field.inputProps} />
        {field.touched && field.errors.map((error, index) => (
            <div key={index}>{error}</div>
        ))}
    </div>
);
```

Now errors will be visible only after field is touched (i.e. onFocus and onBlur were triggered at least once). Though nothing will be displayed if user will just click submit. Let's fix that as well:
```typescript
return (
    <div>
        <input {...props} {...field.inputProps} />
        {(field.touched || field.submitFailed) && field.errors.map((error, index) => (
            <div key={index}>{error}</div>
        ))}
    </div>
);
```

Property `submitFailed` is a flag that is changed to `true` if submit was triggered and field had a validation errors.

Used functionality in these examples is similar to [Final Form](https://final-form.org/).

### Form submission errors

In the end you probably want to send your form values using some API. Minimal code would look like this.

```typescript
import { Field, useForm } from "pateo";
import { useState } from "react";

function fakeApi(values: any) {
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
}

function required(value: any) {
    if (!value) return "Field is required";
}

function ExampleField({ field, ...props }: { field: Field }) {
    return (
        <div>
            <input {...props} {...field.inputProps} />
            {(field.touched || field.submitFailed) && field.errors.map((error, index) => (
                <div key={index}>{error}</div>
            ))}
        </div>
    );
}

export function ExampleForm() {

    const [loading, setLoading] = useState(false);
    const form = useForm("awesome-form");

    form.onSubmit = (values) => {
        setLoading(true);
        fakeApi(values)
            .then((response) => {
                console.log("Yay!");
            })
            .catch((error) => {
                console.error("Something gone wrong :(");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <form.Form>
            <form.Field
                component={ExampleField}
                name="username"
                validate={required}
                disabled={loading}
            />
            <form.Field
                component={ExampleField}
                name="password"
                type="password"
                validate={required}
                disabled={loading}
            />
            <form.Submit value="Submit" disabled={loading} />
        </form.Form>
    );

}
```

In theory API could return object with validation errors. You can set form erorrs using `setSubmissionErrors` method.

```typescript
function fakeApi(values: any) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, 1000);
    });
}
```

```typescript
form.onSubmit = (values) => {
    setLoading(true);
    fakeApi(values)
        .then((response) => {
            console.log("Yay!");
        })
        .catch((error) => {
            form.setSubmissionErrors({
                username: "User not found",
                password: ["Wrong password"],
            });
        })
        .finally(() => {
            setLoading(false);
        });
}
```

You can also use `setSubmissionErrors` method for creating complex multi-field validations. Submission errors will be erased as soon as field validators will be triggered. 

\* Note, that validators passed to field must be the same value every time (don't implemented them inside component function, it's going to be new object every rerender), otherwise submissions erors will get erased immediately, because field will think it got new validators and needs to revalidate the value.

### PromiseExt with forms

While user is waiting API response he might navigate to other route and form component will get unmounted, however API's promise will persist existing and continue executing as soons as API will return a result. This can lead to application crash and unwanted behaviour. This issue can be solved using `PromiseExt` class. We can just wrap the promise created by our API function and save it to some variable. Then if component gets unmounted we just cancel our promise so it willn't be executed when API will return response. Example extending previous code:
```typescript
export function ExampleForm() {

    const [loading, setLoading] = useState(false);
    const apiHandle = useRef<PromiseExt | null>(null);
    const form = useForm("awesome-form");

    form.onSubmit = (values) => {
        setLoading(true);
        apiHandle.current = new PromiseExt(fakeApi(values))
            .then((response) => {
                console.log("Yay!");
            })
            .catch((error) => {
                form.setSubmissionErrors({
                    username: "User not found",
                    password: ["Wrong passowrd"],
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        return () => {
            apiHandle.current?.cancel();
        }
    }, []);

    return (
        <form.Form>
            <form.Field
                component={ExampleField}
                name="username"
                validate={required}
                disabled={loading}
            />
            <form.Field
                component={ExampleField}
                name="password"
                type="password"
                validate={required}
                disabled={loading}
            />
            <form.Submit value="Submit" disabled={loading} />
        </form.Form>
    );

}
```