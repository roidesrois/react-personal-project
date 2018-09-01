// Core
import React, { PureComponent } from 'react';
import { string, func } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

import Checkbox from '../../theme/assets/Checkbox';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';
import Star from '../../theme/assets/Star';
import { api } from "../../REST";

// import searchIcon from '../../theme/assets/search-icon.svg';
// import plusIcon from '../../theme/assets/plus-icon.svg';

export default class Task extends PureComponent {
    static propTypes = {
        _updateTaskAsync: func.isRequired,
    };

    state = {
        isTaskEditing: false,
        newMessage:    '',
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

    _setTaskEditingState = (isTaskEditing) => {

        this.setState({
            isTaskEditing,
        });

        if (isTaskEditing) {
            this._taskInputFocus();
        }

        console.log("_setTaskEditingState", isTaskEditing);
    };

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;

        if (newMessage === message) {
            this._setTaskEditingState(false);

            return null;
        }

        _updateTaskAsync();

        this._setTaskEditingState(false);
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }

        this._setTaskEditingState();
    };

    _cancelUpdatingTaskMessage = () => {

    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync } = this.props;

        const completedTask = this._getTaskShape();

        completedTask.completed = !completedTask.completed;

        _updateTaskAsync(completedTask);
    };

    _toggleTaskFavoriteState = () => {
        return null;
    };

    _removeTask = () => {
        return null;
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

    render () {
        return (<li className = { Styles.task }>
            <div className = 'content'>
                <Checkbox
                    checked = { false }
                    className = 'toggleTaskCompletedState'
                    color1 = '#3B8EF3'
                    color2 = '#FFF'
                    inlineBlock
                    onClick = { this._toggleTaskCompletedState }
                />
                <input
                    disabled
                    maxLength = { 50 }
                    ref = { this.taskInput }
                    onChange = { this._updateNewTaskMessage }
                    onKeyDown = { this._updateTaskMessageOnKeyDown }
                    type = 'text'
                    value = 'Выполнить важную задачу.'
                />
            </div>

            <div className = 'actions' >
                <Star
                    checked = { false }
                    className = 'toggleTaskFavoriteState'
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    inlineBlock
                    onClick = { this._toggleTaskFavoriteState }
                />
                <Edit
                    checked = { false }
                    className = 'updateTaskMessageOnClick'
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    inlineBlock
                    onClick = { this._updateTaskMessageOnClick }
                />
                <Remove
                    className = 'removeTask'
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    inlineBlock
                    onClick = { this._removeTask }
                />
            </div>
        </li>);
    }
}
