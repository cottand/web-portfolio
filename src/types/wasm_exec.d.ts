declare global {
    export interface Window {
        Go: {
            new (): {
                run: (inst: WebAssembly.Instance) => Promise<void>
                importObject: WebAssembly.Imports
            }
        }
    }
}