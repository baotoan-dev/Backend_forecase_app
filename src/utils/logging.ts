import chalk from "chalk";

const logging = {
    success: (args1: String, args2: any = null) => {
        console.log(
            chalk.bold.green(`[SUCCESS] [${new Date().toLocaleString()}]`),
            chalk.greenBright(args1)
        );
        console.log(args2 ? args2 : "");
    },
    info: (args1: String, args2: any = null) => {
        console.log(
            chalk.bold.blue(`[INFO] [${new Date().toLocaleString()}]`),
            chalk.blueBright(args1)
        );
        console.log(args2 ? args2 : "");
    },
    warning: (args1: String, args2: any = null) =>
        console.log(
            chalk.bold.yellow(`\n[WARNING] [${new Date().toLocaleString()}] `),
            chalk.yellowBright(args1),
            args2 ? chalk.yellowBright(`\n${args2}`) : ""
        ),
    error: (args1: String, args2: any = null) =>
        console.log(
            chalk.bold.red(`\n[ERROR] [${new Date().toLocaleString()}] `),
            chalk.redBright(args1),
            args2 ? chalk.redBright(`\n${args2}`) : ""
        ),
};

export default logging;
