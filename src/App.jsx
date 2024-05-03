import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import emailjs from "@emailjs/browser";

import "./App.css";

function App() {
  const [send, setSend] = useState(false);
  const [error, setError] = useState(false);
  const form = useRef();

  return (
    <div className='app-container'>
      <Formik
        initialValues={{
          name: "",
          email: "",
          contactnum: "",
          message: "",
        }}
        validate={(values) => {
          let errors = {};

          // Validación nombre.
          if (!values.name) {
            errors.name = "Please insert a name.";
          } else if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,40}$/.test(values.name)) {
            errors.name =
              "The name can only contain uppercase and lowercase letters. It must not contain numbers or special characters.";
          }

          // Validación correo.
          if (!values.email) {
            errors.email = "Please insert your email.";
          } else if (
            !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
              values.email
            )
          ) {
            errors.email = "The email entered is invalid, please try again.";
          }

          // Validación teléono.
          if (!values.contactnum) {
            errors.contactnum = "Please type a contact number."
          } else if (!/^(?:\+\d{1,3}\s?)?(?:\d\s?){6,14}\d$/.test(values.contactnum)) {
            errors.contactnum = "Please enter a valid phone number."
          }

          // Validación mensaje
          if (!values.message) {
            errors.message = "Please write a message.";
          }

          return errors;
        }}
        // Usamos "_" para omitir el primer parametro y poder acceder a los métodos en el segundo. (Convención).
        onSubmit={async (_, { resetForm }) => {
          setError(false);
          try {
            await emailjs.sendForm(
              "[ID SERVICIO]",
              "[ID TEMPLATE]",
              form.current,
              {
                publicKey: "[PUBLIC ID]",
              }
            );
            resetForm();
            setSend(true);
            setTimeout(() => setSend(false), 5000);
          } catch (error) {
            setError(true);
            console.log(error);
          }
        }}
      >
        {({ errors }) => (
          <Form ref={form} className='form'>
            <div>
              <h1>
                Emails de contacto con <span>Email JS</span>
              </h1>
              <div>
                <label htmlFor='name'>Name:</label>
                <Field
                  type='text'
                  name='name'
                  id='name'
                  placeholder='Robert Smith'
                  autoComplete='off'
                />
                <ErrorMessage
                  name='name'
                  component={() => <div className='error'>{errors.name}</div>}
                />
              </div>
              <div>
                <label htmlFor='name'>Email:</label>
                <Field
                  type='email'
                  name='email'
                  id='email'
                  placeholder='example123@gmail.com'
                />
                <ErrorMessage
                  name='email'
                  component={() => <div className='error'>{errors.email}</div>}
                />
              </div>
              <div>
                <label htmlFor='contactnum'>Phone number:</label>
                <Field
                  type='tel'
                  name='contactnum'
                  id='contactnum'
                  autoComplete='off'
                />
                <ErrorMessage
                  name='contactnum'
                  component={() => (
                    <div className='error'>{errors.contactnum}</div>
                  )}
                />
              </div>
              <div>
                <label htmlFor='message'>Your message:</label>
                <Field
                  name='message'
                  as='textarea'
                  placeholder='Type your message here.'
                />
                <ErrorMessage
                  name='message'
                  component={() => (
                    <div className='error'>{errors.message}</div>
                  )}
                />
              </div>
            </div>
            <button type='submit'>Confirm</button>
            {send && <p className='success'>Form submitted successfully!</p>}
            {error && (
              <p className='notsend'>
                Seems like there was an error while submitting the form, please
                try again.
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
