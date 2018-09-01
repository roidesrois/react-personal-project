import { MAIN_URL, TOKEN } from './config';

export const api = {

    async fetchTasks () {
        const response = await fetch(`${MAIN_URL}`, {
            method:  'GET',
            headers: {
                'content-type': 'application/json',
                Authorization:  TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error('Tasks were not loaded.');
        }

        //pereimenovanie 'data' pri destruktizacii - { data: posts }
        const { data: tasks } = await response.json();

        return tasks;
    },
    async createTask (newTaskMessage) {

        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'content-type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({
                newTaskMessage,
            }),
        });

        if (response.status !== 200) {
            throw new Error('Task were not created.');
        }

        const { data: task } = await response.json();

        return task;
    },
    async updateTask (updatedTaskMessage) {

        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'content-type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({
                updatedTaskMessage,
            }),
        });

        if (response.status !== 200) {
            throw new Error('Task were not updated.');
        }

        const { data: task } = await response.json();

        return task;
    },
    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error('Task were not deleted');
        }

        return null;
    },

    async completeAllTasks (completedTasks) {
        const response = await fetch(`${MAIN_URL}`, {
            method:  'PUT',
            headers: {
                Authorization: TOKEN,
            },
            body: JSON.stringify({
                completedTasks,
            }),
        });

        if (response.status !== 200) {
            throw new Error('Tasks were not completed');
        }

        return null;
    },

};
