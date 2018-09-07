// Core
import React, { PureComponent } from 'react';
import { string, func } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

import Checkbox from '../../theme/assets/Checkbox';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';
import Star from '../../theme/assets/Star';

import cx from 'classnames';

export default class Task extends PureComponent {
    static propTypes = {
        _updateTaskAsync: func.isRequired,
        message:          string,
    };

    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    taskInput = React.createRef();

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        if (!newMessage.trim()) {
            return null;
        }

        const enterKey = event.key === 'Enter';
        const escapeKey = event.key === 'Escape';

        if (enterKey) {
            this._updateTask();
        }

        if (escapeKey) {
            this._cancelUpdatingTaskMessage();
        }
    };

    // svoystvo clasa, t.k. zapisano  peremennuyu, cherez "="
    _setTaskEditingState = (isTaskEditing) => {
        this.setState({
            isTaskEditing,
        });

        if (isTaskEditing) {
            this._taskInputFocus();
        }
    };

    // method klassa
    // someMethod () {
    //
    // }

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;

        if (newMessage === message) {
            this._setTaskEditingState(false);

            return null;
        }

        _updateTaskAsync(this._getTaskShape({ message: newMessage }));

        this._setTaskEditingState(false);
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }

        this._setTaskEditingState(true);
    };

    _cancelUpdatingTaskMessage = () => {
        this._setTaskEditingState(false);

        this.setState({
            newMessage: this.props.message,
        });
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        const completedTask = this._getTaskShape({ completed: !completed });

        _updateTaskAsync(completedTask);
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        const favoriteTask = this._getTaskShape({ favorite: !favorite });

        _updateTaskAsync(favoriteTask);
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _taskInputFocus = () => {
        this.taskInput.current.focus();
    };

    _updateNewTaskMessage = (event) => {
        const { value } = event.target;

        this.setState({
            newMessage: value,
        });
    };

    _getTaskStyles = () => {
        const { completed } = this.props;
        // const taskCompleted = this.taskCompleted();

        return cx(Styles.task, {
            [Styles.completed]: completed,
        });
    };

    render () {
        const { message, favorite, completed } = this.props;
        const { isTaskEditing, newMessage } = this.state;

        const taskStyles = this._getTaskStyles();

        return (
            <li className = { taskStyles }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        inlineBlock
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                    />
                </div>

                <div className = { Styles.actions }>
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
