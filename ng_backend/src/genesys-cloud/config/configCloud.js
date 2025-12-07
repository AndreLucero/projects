import { readFile, writeFile } from 'fs/promises';

const pathFile = 'src/genesys-cloud/config/configCloud.json';

export async function getFile(){
    const file =  await readFile(pathFile, 'utf-8');
    const formatFile = JSON.parse(file);

    return formatFile;
}

export async function getFileByOrg(org){
    const file = await getFile();
    return file[ org ] ?? false;
}


export async function updateFile(newValue){

    const currentFile = await getFile();

    const newJson = JSON.stringify({
        ...currentFile,
        ...newValue
    });

    await writeFile( pathFile, newJson, 'utf-8');
}