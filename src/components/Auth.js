import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import { useRouter } from "next/router";
import AuthForm from "components/AuthForm";
import AuthSocial from "components/AuthSocial";

function Auth(props) {
  const router = useRouter();
  const [formAlert, setFormAlert] = useState(null);

  const handleAuth = (user) => {
    router.push(props.afterAuthPath);
  };

  const handleFormAlert = (data) => {
    setFormAlert(data);
  };

  return (
    <>
      {formAlert && (
        <Box mb={3}>
          <Alert severity={formAlert.type}>{formAlert.message}</Alert>
        </Box>
      )}

      <AuthForm
        type={props.type}
        buttonAction={props.buttonAction}
        onAuth={handleAuth}
        onFormAlert={handleFormAlert}
      />

      {["signup", "signin"].includes(props.type) && (
        <>
          {props.providers && props.providers.length && (
            <>
              <Box textAlign="center" fontSize={12} mt={4}>
                OR
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Auth;