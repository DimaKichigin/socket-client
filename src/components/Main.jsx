import React from 'react'
import styles from '../styles/Main.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
	
const FIELDS = {
	NAME: 'name',
	ROOM: 'room',
}

export default function Main() {
	const { NAME, ROOM } = FIELDS

	// Создаем состояние для Link
	const [values, setValues] = useState({ 
		[NAME]: '', 
		[ROOM]: '' 
	})

	const handleChange = ({ target: { value, name } }) => {
		setValues({ ...values, [name]: value })
	}


	// метод массивов .some определяет удовлетворяет ли хотя бы один элемент массива заданным условиям в функции
	const handleClick = (e) => {
		const isDisabled = Object.values(values).some((v) => !v)
		if (isDisabled) {
			e.preventDefault()
		}
	}

	return (
		<div className={styles.wrap}>
			<div className={styles.container}>
				<h1 className={styles.heading}>Join</h1>	
				
				<form className={styles.form}>
				<div className={styles.group}>
					<input
						type="text" 
						name="name" 
						value={values[NAME]} 
						placeholder="Name"
						className={styles.input}
						autoComplete="off"
						required
						onChange={handleChange}
					/>
					<input
						type="text" 
						name="room" 
						value={values[ROOM]}
						placeholder="Room"
						className={styles.input}
						autoComplete="off"
						required
						onChange={handleChange}
					/>
				</div>
				<Link 
					className={styles.group}
					onClick={handleClick}
					to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}>
					
					<button type="submit" className={styles.button}>
						Sign In
					</button>
				</Link>
				</form>
			</div>
		</div>
	)
}