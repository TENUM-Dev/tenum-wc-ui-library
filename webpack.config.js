import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.ts",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "auto",
    clean: true
  },
  devServer: {
    port: 3001,
    static: path.join(__dirname, "dist"),
    headers: { "Access-Control-Allow-Origin": "*" }
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: [
            ["@babel/preset-env", { targets: "defaults" }],
            ["@babel/preset-react", { runtime: "automatic" }],
            "@babel/preset-typescript"
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: "helloLib",
      filename: "remoteEntry.js",
      exposes: {
        "./Hello": "./src/Hello",
        "./JsonForm": "./src/JsonForm",
        "./Del": "./src/Del",
        "./index": "./src/index"
      },
      shared: {
        // Needed for local development
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        "@chakra-ui/react": { singleton: true, requiredVersion: "2.10.9" },
        "@emotion/react": { singleton: true, requiredVersion: "11.14.0" },
        "@emotion/styled": { singleton: true, requiredVersion: "11.14.1" }
      }
    }),
    new HtmlWebpackPlugin({
      templateContent: `
        <!doctype html>
        <html>
          <head><meta charset=\"utf-8\"><title>hello-lib</title></head>
          <body>
            <h1>hello-lib dev</h1>

            <h2>Simple Hello Component</h2>
            <x-hello name="Bob" id="helloComponent"></x-hello>
            <script>
              const helloElement = document.getElementById('helloComponent');
              if (helloElement) {
                helloElement.addEventListener('helloclick', (event) => {
                  console.log('Hello clicked!', event.detail);
                  alert('Hello clicked! Name: ' + event.detail.name);
                });
              }
            </script>

            <hr>

            <h2>JSON Schema Form Component</h2>
            <x-jsonform id="myForm"></x-jsonform>

            <script>
              // Wait for the component to be ready
              setTimeout(() => {
                const formElement = document.getElementById('myForm');
                if (!formElement) return;

                // Listen for custom events dispatched by r2wc (events will bubble up)
                formElement.addEventListener('formchange', (event) => {
                  console.log('Form changed:', event.detail);
                });

                formElement.addEventListener('formsubmit', (event) => {
                  console.log('Form submitted:', event.detail);
                  alert('Form submitted! Check console for data.');
                });

                formElement.addEventListener('formerror', (event) => {
                  console.log('Form errors:', event.detail);
                });

                // Set the JSON Schema
                formElement.schema = {
                  "type": "object",
                  "properties": {
                    "firstName": {
                      "type": "string",
                      "title": "First Name"
                    },
                    "lastName": {
                      "type": "string",
                      "title": "Last Name"
                    },
                    "age": {
                      "type": "number",
                      "title": "Age"
                    },
                    "email": {
                      "type": "string",
                      "format": "email",
                      "title": "Email"
                    }
                  },
                  "required": ["firstName", "lastName"]
                };

                // Set the UI Schema (optional)
                formElement.uischema = {
                  "firstName": {
                    "ui:autofocus": true
                  },
                  "age": {
                    "ui:widget": "updown"
                  }
                };

                // Set initial form data
                formElement.formData = {
                  "firstName": "John",
                  "lastName": "Doe",
                  "age": 30,
                  "email": "john.doe@example.com"
                };
              }, 100);
            </script>
          </body>
        </html>
      `
    })
  ],
  devtool: "source-map",
  mode: "development"
};
