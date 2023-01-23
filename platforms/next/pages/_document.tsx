import 'app/i18n';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import Tamagui from '../tamagui.config';
import { AppRegistry } from 'react-native';
import { Children } from 'react';

export default class Document extends NextDocument {
  static async getInitialProps({ renderPage }: any) {
    AppRegistry.registerComponent('Main', () => Main);
    const page = await renderPage();

    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('Main');
    const styles = [
      getStyleElement(),
      <style key="tamagui-css" dangerouslySetInnerHTML={{ __html: Tamagui.getCSS() }} />,
    ];
    return { ...page, styles: Children.toArray(styles) };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
