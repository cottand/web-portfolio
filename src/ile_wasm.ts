// `wasm` variable contains URL
// of our WASM binary, set by Nix
// @ts-ignore

// file placed here by Nix
import './assets/imported/wasm_exec.js'


// load and run our Go code
// @ts-ignore
export async function loadIleWasm() {
    if (!WebAssembly) {
        throw new Error('WebAssembly is not supported in your browser')
    }


    // @ts-ignore
    const go = new window.Go()
    const fetched = await fetch('/assets/imported/bin/js_wasm/ile.wasm.gzip')
        .catch((_) => fetch("nico.dcotta.com/assets/imported/bin/js_wasm/ile.wasm.gzip"))

    // @ts-ignore
    const decompressed = fetched.body?.pipeThrough(new DecompressionStream("gzip"));
    // @ts-ignore
    const inst = await WebAssembly.instantiate(
        await new Response(decompressed).arrayBuffer(),
        go.importObject,
    );

    // const inst = await WebAssembly.instantiate(await fetched.arrayBuffer())

    // run it
    go.run(inst.instance)

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
