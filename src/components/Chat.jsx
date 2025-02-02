import React, { useState } from 'react'
import io from 'socket.io-client'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EmojiPicker from 'emoji-picker-react'
import Messages from './Messages'

import icon from "../images/emoji-add.svg"
import styles from '../styles/Chat.module.css'

const socket = io.connect("http://localhost:5000")
	
export default function Chat() {
	const navigate = useNavigate()
	
	// берем параметры локации из хука useLocation
	const { search } = useLocation()

// ========== Состояния

	const [params, setParams] = useState({ room: "", user: "" })
	const [state, setState] = useState([])
	// Состояние под импут сообщения
	const [message, setMessage] = useState('')
	// Состояние для смайликов
	const [isOpen, setOpen] = useState(false)
	// Состояние под количество участников в комнате
	// Изначально количество = 0
	const [users, setUsers] = useState(1)

// ======= useEffect ======================

	useEffect(() => {
		const searchParams = Object.fromEntries(new URLSearchParams(search))
		setParams(searchParams)
		socket.emit('join', searchParams)
	}, [search])

	// Получаем с сокета сообщение. Получаем дату через деструктуризацию
	useEffect(() => {
		socket.on('message', ({ data }) => {
		// В этот массив будем складывать все сообщения, которые будут приходить
		// от socket.io (ну в смысле от пользователей)
		setState((_state) => ([..._state, data]))
		})
	}, [])

	// Получаем имя комнаты с сокета с бэка. И получаем пользователей через деструктуризацию
	useEffect(() => {
		socket.on('room', ({ data: { users} }) => {
		// 
		setUsers(users.length)
		})
	}, [])

// ========= Функции (onChange) =======================

	// Функция удаления пользователя из комнаты
	// После этого, ее нужно реализовать на бэкенде в server/index.js
	const leftRoom = () => {
		socket.emit('leftRoom', { params })
		navigate('/')
	}

	// Функция сообщения
	const handleChange = ( { target: { value }}) => setMessage(value)

	// Функция для открытия смайликов
	const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`)

	// Функция для отправки сообщения
	const handleSubmit = (e) => {
		e.preventDefault()

		if (!message) {
			return 
		}

		// Отправляем ивент на сокет с помощь emit
		// Туда входит самое сообщение и параметры
		socket.emit('sendMessage', { message, params })

		// Очищаем после отправки
		setMessage("")
	}

// ============== Комната чата с людьми

	return (
		<div className={styles.wrap}>
		<div className={styles.header}>
			<div className={styles.title}>
				Room: {params.room}
			</div>
			<div className={styles.users}>
				{users} users here
			</div>
			<button className={styles.left} onClick={leftRoom}>
				Left the room
			</button>
			
		</div>

			{/* Бокс с сообщениями */}
			<div className={styles.messages}>
			<Messages messages={state} name={params.name}/>
			</div>
			
			{/* Форма с инпутом ввода */}
			<form className={styles.form} onSubmit={handleSubmit}>
				{/* Взяли с Main.jsx */}
				<div className={styles.input}>
					<input
						type="text" 
						name="message" 
						placeholder="What do you want to say?"
						value={message} 
						onChange={handleChange}
						autoComplete="off"
						required
					/>
				</div>	
				{/* Добавление эмоджи */}
				<div className={styles.emoji}>
					<img 
						src={icon} 
						alt="Emoji"
						onClick={() => setOpen(!isOpen)}
						/>
					
					{/* Отображаем только при событии isOpen */}
					{isOpen && (
						<div className={styles.emojies}>
					{/* По событию клика будет открываться окно с эмоджи из пакета реакта со смайликами */}
						<EmojiPicker onEmojiClick={onEmojiClick} />
					</div>
					)}
						</div>

					{/* Кнопка отправки сообщения */}
					<div className={styles.button}>
						<input 
							type="submit" 
							onSubmit={handleSubmit}
							value="Send a message" />
					</div>
			</form>

		</div>
	)
}