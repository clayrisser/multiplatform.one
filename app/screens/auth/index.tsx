import { withAuthenticated } from "@multiplatform.one/keycloak";
import { withDefaultLayout } from "app/layouts/Default";
import React from "react";
import { YStack } from "tamagui";

function Auth() {
    return <YStack>Auth</YStack>
}


export default withAuthenticated(withDefaultLayout(Auth))
