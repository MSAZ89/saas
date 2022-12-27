function submit(data) {
  return Promise.reject(
    new Error(
      "Contact form integration is disabled. See src/util/contact.js for more details."
    )
  );
}

const contact = { submit };

export default contact;
