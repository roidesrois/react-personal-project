// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

import Spinner from '../Spinner';
import Task from '../Task';

import Checkbox from '../../theme/assets/Checkbox';


export default class Scheduler extends Component {

    state = {
        tasks: [],
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _updateTasksFilter = (event) => {
        const { value } = event.target;

        this.setState({
            tasksFilter: value.toLowerCase(),
        });
    };

    _updateNewTaskMessage = (event) => {
        const { value } = event.target;

        this.setState({
            newTaskMessage: value,
        });
    };

    _checkAllTaskIsCompleted = (task) => {
        return task.completed === true;
    };

    _getAllCompleted = () => {
        this._fetchTasksAsync();

        const { tasks } = this.state;

        return tasks.every(this._checkAllTaskIsCompleted);
    };

    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });
    };

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);

            // dannie posti uje prishli s servera
            const tasks = await api.fetchTasks();

            this.setState({
                tasks,
            });

        } catch (error) {
            console.error(error);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _createTaskAsync = async (event) => {
        event.preventDefault();

        const { newTaskMessage } = this.state;

        if (!newTaskMessage.trim()) {
            return null;
        }

        try {
            this._setTasksFetchingState(true);

            const task = await api.createTask(newTaskMessage);

            this.setState((prevState) => ({
                tasks:          [task, ...prevState.tasks],
                newTaskMessage: '',
            }));
        } catch (error) {
            console.error();
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTaskAsync = async (updatedTaskMessage) => {
        try {
            this._setTasksFetchingState(true);

            await api.updateTask(updatedTaskMessage);

        } catch (error) {
            console.error();
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);

            await api.removeTask(id);

        } catch (error) {
            console.error();
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _completeAllTasksAsync = async () => {

        const allCompleted = this._getAllCompleted();

        if (allCompleted) {
            return null;
        }

        const { tasks } = this.state;

        const notCompletedTasks = tasks
            .filter((task) => task.completed === false);

        const competedTasks = notCompletedTasks.map((task) => task.completed === false ? { ...task, ...{ completed: true }} : task);

        try {
            this._setTasksFetchingState(true);

            await api.completeAllTasks(notCompletedTasks);

            this.setState({
                tasks: competedTasks,
            });

        } catch (error) {
            console.error();
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    render () {
        const { tasks, tasksFilter, newTaskMessage } = this.state;

        const tasksJSX = tasks.map((task) => (
            <Task
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
                completed = { task.completed }
                favorite = { task.favorite }
                id = { task.id }
                key = { task.id }
                message = 'Выполнить важную задачу (создано в конструкторе).'
            />
        ));

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'search' onChange = { this._updateTasksFilter } value = { tasksFilter } />
                    </header>
                    <section>
                        <form
                            onSubmit = { this._createTaskAsync }>
                            <input className = 'createTask' maxLength = { 50 } placeholder = 'Описaние моей новой задачи' type = 'text' onChange = { this._updateNewTaskMessage } value = { newTaskMessage } />
                            <button /*onClick = { this._updateNewTaskMessage }*/ >Добавить задачу</button>
                        </form>
                        <div className = 'overlay'>
                            <ul>
                                <FlipMove duration = { 400 }>
                                    {tasksJSX}
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { false }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = 'completeAllTasks'>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
