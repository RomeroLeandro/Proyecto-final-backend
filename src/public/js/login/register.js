registerButton.addEventListener("click", async (e) => {
  e.preventDefault();

  console.log("Botón de registro clicado");

  const first_name = first_name_input.value;
  const last_name = last_name_input.value;
  const email = email_input.value;
  const age = age_input.value;
  const password = password_input.value;

  console.log("Datos del formulario:");
  console.log("Nombre:", first_name);
  console.log("Apellido:", last_name);
  console.log("Email:", email);
  console.log("Edad:", age);
  console.log("Contraseña:", password);

  const response = await fetch("/api/sessions/register", {
    credentials: "include",
    method: "POST",
    body: JSON.stringify({
      first_name,
      last_name,
      email,
      age,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Solicitud fetch enviada al servidor");

  const data = await response.json();

  console.log("Respuesta del servidor:");
  console.log(data);

  if (response.ok) {
    Swal.fire({
      title: "Success",
      text: "The user registered successfully!",
      icon: "success",
      didClose: () => {
        window.location.href = "/";
      },
    });
  } else {
    Swal.fire({
      title: "Error",
      text: `${data.error}`,
      icon: "error",
    });
  }
});
