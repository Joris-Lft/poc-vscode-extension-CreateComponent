import * as vscode from "vscode";
import * as fs from "fs";
import { component, index, story, style, test } from "./templates";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createFile",
    async () => {
      try {
        // handle target folder selection
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const defaultUri = workspaceFolders
          ? workspaceFolders[0].uri
          : undefined;

        const folder = await vscode.window.showOpenDialog({
          canSelectFiles: false,
          canSelectFolders: true,
          defaultUri,
        });
        if (!folder) {
          return;
        }

        // handle filename and destination path
        const fileName = await vscode.window.showInputBox({
          placeHolder: "Enter file name",
        });
        if (!fileName) {
          return;
        }
        const folderPath = `${folder[0].path}/${fileName}`;

        // handle files content

        // create component directory
        if (fs.existsSync(folderPath)) {
          vscode.window.showErrorMessage(`Folder ${fileName} already exists`);
          return;
        }
        fs.mkdir(folderPath, { recursive: true }, (err) => {
          if (err) {
            vscode.window.showErrorMessage(
              "An error occurred while creating the folder: " + err.message
            );
            return;
          }
        });

        // create files with content
        fs.writeFileSync(
          `${folderPath}/index.tsx`,
          Buffer.from(index(fileName))
        );
        fs.writeFileSync(
          `${folderPath}/${fileName}.tsx`,
          Buffer.from(component(fileName))
        );
        fs.writeFileSync(`${folderPath}/${fileName}.scss`, Buffer.from(style));
        fs.writeFileSync(
          `${folderPath}/${fileName}.stories.tsx`,
          Buffer.from(story(fileName))
        );
        fs.writeFileSync(
          `${folderPath}/${fileName}.test.tsx`,
          Buffer.from(test(fileName))
        );

        vscode.window.showInformationMessage(
          `Component ${fileName} created successfully`
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          "An error occurred while creating the file: " + (error as any).message
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}