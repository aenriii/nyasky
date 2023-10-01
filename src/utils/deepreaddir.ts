import { readdir, stat } from "fs/promises";

type Dir = { [key: string]: Dir | string };
export default async function deepreaddir(src: string): Promise<{
    allFiles: string[],
    dir: Dir
}> {
    const allFiles: string[] = [];
    const dir: { [key: string]: Dir | string } = {};

    for (let _file of await readdir(src)) {
        const file = `${src}/${_file}`;
        if ((await stat(file)).isDirectory()) {
            let { allFiles: deep, dir: deepDir } = await deepreaddir(file);
            allFiles.push(...deep);
            dir[_file] = deepDir;
        }
        else {
            allFiles.push(file);
            dir[_file] = file;
        }
    }
    return { allFiles, dir };
}