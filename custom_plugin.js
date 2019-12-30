
class Custom_Plugin {
    apply(compiler) {
        compiler.hooks.done.tap("Custom Plugin", stats => {
            console.log("Custom Plugin: done");
        })

        compiler.plugin("emit", (compilation, callback) => {    // compiler.plugin() function
            const source = compilation.assets["main.js"].source();
            compilation.assets["main.js"].source = () => {
                const banner = [
                    "/**",
                    " * Banner Plugin Result",
                    " * Build Date: " + new Date(),
                    " */"
                ].join("\n");
                return banner + "\n\n" + source;
            }
            // console.log(source);
            callback();
        })
    }
}

module.exports = Custom_Plugin;