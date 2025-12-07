
export const jobDefinitions = ( agenda => {

    agenda.define("primera prueba", (job) => {
        const {name, path} = job.attrs.data;

        console.log(`Mi primera agenda. nombre: ${name}, path: ${path}`);
    });

    agenda.define('taskSchedule', job => {
        const { message } = job.attrs.data;

        console.log(`Tarea: ${message}`);
    });

})