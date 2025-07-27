// `wasm` variable contains URL
// of our WASM binary, set by Nix
// @ts-ignore

// file placed here by Nix
import './assets/wasm_exec.js'


// load and run our Go code
// @ts-ignore
export async function loadGoWasm()  {
    if (!WebAssembly) {
        throw new Error('WebAssembly is not supported in your browser')
    }

    // @ts-ignore
    const go = new window.Go()
    const result = await WebAssembly.instantiateStreaming(
        // load the binary
        fetch('/assets/bin/js_wasm/ile'),
        go.importObject
    )

    // run it
    go.run(result.instance)

    // wait until it creates the function we need
    // @ts-ignore
    await until(() => window.CheckAndShowTypes != undefined)
}

// helper Promise which waits until `f` is true
const until = (f: () => boolean): Promise<void> => {
    return new Promise(resolve => {
        const intervalCode = setInterval(() => {
            if (f()) {
                resolve()
                clearInterval(intervalCode)
            }
        }, 10)
    })
}
