import { useKeycloak, withAuthenticated } from "@multiplatform.one/keycloak";
import { withDefaultLayout } from "app/layouts/Default";
import { YStack, H1, Paragraph, XStack, Button, Avatar, Separator, SimpleDialog, Dialog, Card, Text, H3, Theme, Anchor, Label } from "ui";
import { ChevronRight, Home } from "@tamagui/lucide-icons";
import { useLink } from 'solito/link';


function Auth() {
    const keycloak = useKeycloak();

    // if (!keycloak) {
    //     return null;
    // }
    console.log("keycloak", keycloak)
    return (

        <YStack fullscreen padding="$4" >
            <Theme >

                <XStack
                    justifyContent="space-between"
                    flexDirection="row-reverse"
                    flexWrap="wrap"
                    alignItems="flex-end"

                >
                    <Theme>
                        <SimpleDialog asRightSideSheet withoutCloseButton trigger={
                            <Button size="$4" circular>

                                <Theme name='light'>
                                    <Avatar theme='active' bg="$backgroundFocus" circular size="$4">
                                        <Avatar.Image
                                            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F61%2F61205.png&f=1&nofb=1&ipt=a9586522eaa6b92658d2a461eb4eeedcc9e418ba16e5a4e0cab477a02c846947&ipo=images"
                                        />
                                    </Avatar>
                                </Theme>


                            </Button>
                        }
                            contentStyle={{
                                padding: "$0",
                                gap: "$1",
                                jc: 'flex-start',
                                ai: 'center'
                            }}
                        >
                            <YStack >
                                {keycloak?.username}
                                <Button iconAfter={ChevronRight} onPress={() => { window.location.href = "/" }}>Home</Button>
                                <Button iconAfter={ChevronRight} >Edit Profile</Button>
                                <Button iconAfter={ChevronRight}>Set status</Button>
                                <Button iconAfter={ChevronRight} onPress={() => keycloak?.logout()}>Sign out</Button>
                            </YStack>

                        </SimpleDialog>
                    </Theme>

                    <H3>
                        Welcome <Text color='$blue10Dark'>{keycloak?.username}</Text>!
                    </H3>

                </XStack>
                <YStack
                    f={1}
                    jc="center"
                    ai="center"
                    width='100%'
                    flexWrap="wrap"
                >
                    <Card
                        elevation="$10"
                        maw={700}
                        padded
                        paddingVertical="$10"
                        $sm={{ paddingVertical: "$7" }}

                    >
                        <YStack gap="$9" flexWrap="wrap">

                            <H1 $sm={{ fontSize: "$8" }} ta='center'>Keycloak Authentication</H1>
                            <Separator />

                            <Paragraph
                                fontFamily="$silkscreen"
                                ta="center"
                            >
                                you have sucessfully login in keycloak with client id {keycloak?.clientId} using {keycloak?.realm} with {keycloak?.email}
                            </Paragraph>
                            <XStack alignItems="flex-end" jc='flex-end' gap="$2" flexWrap="wrap">
                                <Text marginBottom='$4' > Keycloak Docs </Text>
                                <Anchor marginBottom="$1" alignContent="flex-end" href="https://www.keycloak.org/documentation" target="blank" >
                                    <Button>Docs</Button>
                                </Anchor>

                            </XStack>


                        </YStack>

                    </Card>
                </YStack>
            </Theme>
        </YStack>
    )
}


export default withAuthenticated(withDefaultLayout(Auth))
