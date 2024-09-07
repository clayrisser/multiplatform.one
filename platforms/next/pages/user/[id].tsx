export { getStaticProps } from "multiplatform.one/next";
import UserScreen from "app/screens/user";
import { createGetStaticPaths } from "multiplatform.one/next";

export const getStaticPaths = createGetStaticPaths(["/user/alice"]);

export default UserScreen;
