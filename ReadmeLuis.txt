Modificaciones en usuarios

	controllerAuth.js
		-signin //agregado campo surname
	
Modificaciones en profesores

	EditChallenge
		-Cargar ficheros multimedia
		
	CreateChallenge
		-Cargar ficheros multimedia
	
	TeacherService
		-sendMultimedia, agregado campo type como parametro para el almacenamiento de carpetas del usuario, dividiendo carpetas por usuarios y equipos
		
	ControllerTeacher
		-SendMultimedia 

Modificacioens de estudiantes

	
	App.js 
		-agregado mensajeria
	GroupStudent 
		-agregado selectores, desafios, escritos, equipos y sus respectivas componentes
	Sidebar.js
	
	Agregados 14 componentes referentes a mensajeria, desafios, equipos....
	
Cosas que no he conseguido corregir

	En estudiantes solapamiento con el sidebar con el container al seleccionar grupos
--------------------------------------------------------------------------------------------------------------------
Cambios Luis 31/03/2021

EditWriting
-Agregado modal para eliminarFichero
-ver un fichero multimedia del desafio te abre una nueva ventana
-Corregido variables en el estado que se usaban, borrado codigos comentados,etc

CreateWriting 

-Corregido variables que no se usaban, 
-abrir nueva ventana al visualizar fichero multimedia del desafio

ViewMultimedia 
-Agregado por el momento no se usa, problema si al crearEscrito/editarEscrito abrir una pagina que contenga el fichero multimedia 
del desafio, se pierde los campos actuales del escrito, al redirijirte a una nueva pagina de viewMultimedia

teamStudent 
-Quitando codigo comentado

--------------------------------------------------------------------------------------------------------------------
Cambios Luis 07/04/2021


Student 

ChallengesStudent
-Creada funcion "disabledButtonEdit" para desactivar boton editar desafio
-Creada funcion "disabledButtonCreate" para desactivar boton crearr desafio
-Desactivar el boton de crear/editar si la fecha del desafio expiro

	
ChallengesTeam

-Creada funcion "disabledButtonEdit" para desactivar boton editar desafio
-Creada funcion "disabledButtonCreate" para desactivar boton crearr desafio
-Desactivar boton si no tiene equipo 
-Desactivar boton editar/crear escrito si la fecha del desafio expiro
-Creada funcion que devuelve el nombre del equipo(Agregada campo nombre del equipo a la tabla)

Chat 
-Creado chat (todavia esta en desarrollo)

CreateWriting

-Agregado campo nombre y toda la funcionalidad que conlleva
-StudentService.getWritingWriter, se ha creado la funcionalidad de StudentService.getWritingWriter que comprueba si existe un escrito creado antes de poder crear
esta funcionalidad se ha hecho pensando cuando se crea un escrito colaborativo,para evitar que se creen varios escritos a la vez 
-creada funcion showTypeChallenge que devuelve el titulo del escrito si es colaborativo o individual
-scroolbar de forma momentanea en el editor de texto
-Agregado scrollbar a los ficheros multimedia desafio/escrito

EditWriting

-Agregado campo nombre y toda la funcionalidad que conlleva
-StudentService.getWritingWriter, se ha creado la funcionalidad de StudentService.getWritingWriter que comprueba si existe un escrito creado antes de poder crear
esta funcionalidad se ha hecho pensando cuando se crea un escrito colaborativo,para evitar que se creen varios escritos a la vez 
-creada funcion showTypeChallenge que devuelve el titulo del escrito si es colaborativo o individual
-scroolbar de forma momentanea en el editor de texto
-Corregido la carga de ficheros multimedia del escrito antes no cargaba bien debido a los anidamientos del callbacks en el componentdidmount
-Agregado scrollbar a los ficheros multimedia desafio/escrito

EditWritingTeam

-Se ha creado a modo de prueba con el chat, es una copia del editWriting aunque no tiene el titulo del escrito ni otras cosas,
mas bien la idea es de prueba de interaccion con el chat

TeamsGroup
-Agregado el campo apellido a los integrantes de un equipo porque puede ocurrir que varios usuarios tengan el mismo nombre

TeamStudent
-Agregado el nombre de lider y agregado toda la funcionalidad que con ello conlleva(buscar en los integrantes del grupo y compararlo con el idCreador )

ViewWriting
-CReada esta componente se puede ver un escrito ya finalizado con comentario y puntuacion

WritingsStudent
-Corregido para que se visualice correctamente el nombre y el apellido del estudiante

WritingsTeam

-Agregada  para redirijir y visualizar el escrito en equipo

CreateChallenge
-corregido redireccion a teacher al crear/cancelar desafio

RoutesStudent
-Agregada viewWriting y editWritingTeam

-student-StudentService

-agregada getWritingWriter

-EditWriting/sendWriting  agregado campo title del escrito

App.Css 

-contiene estilo del chat

Writing.Css
-agregado el estilo del editor de texto , editorClassName1,etc

Socket
-Agregado socket para la interaccion entre el cliente y el server 

client/package.json
-agregado socket

server/package.json
-agregado socket

server/src/app.js

-agregado la comunicacion mediante el socket entre el server y el cliente

RouterStudent
-getWritingWriter

ControllerStudent

-sendWriting agregado campo title del escrito
-editWriting agregado campo title del escrito
-getWritingWriter
-sendMultimedia/deleteMultimedia  req.headers.host que me obtiene la url del server , y no como lo hacia antes a capon

modelStudent
-sendWriting agregado campo title del escrito
-editWriting agregado campo title del escrito
-getWritingWriter


--------------------------------------------------------------------------------------------------------------------
Cambios Luis 11/04/2021

Agregada funcionalidad de corregir escritos en profesores

-renombrado de algunas funciones referente a multimedia de profesor para evitar conflictos con multimedia de escritos

sendMultimediaChallenge,getmultimediachallenge

-Creada pestaña de escritos en profesores 

-Agregado selector de desafio en profesores para que segun el desafio seleccionado se liste los escritos referentes a ese desafio

-agregado nueva pagina "EditWriting" en profesores para corregir los escritos de un estudiante/equipo mediante comentario, puntuacion,etc

-Creado listado de escritos de los estudiantes/equipos de un desafio en una tabla que contiene todos los campos del escrito, esta tabla
mostrara distintos campos segun si es estudiante o equipo

-creada funcionalidad de editar escritos para ello se ha modificado   routes,controlador y modelo en el server del profesor


--------------------------------------------------------------------------------------------------------------------
Cambios Luis 22/04/2021

Pequeño resumen 

-Corregido el bucle infinito en profesores, al ver un escrito antes habia que seleccionar un desafio para visualizar el escrito
y habia problemas con el component did update, porque no comparaba el idChallenge del desafio del estado anterior con el estado actuales
y eso genereba el bucle

-En el sidebar de grupos por defecto ya muestra los desafios del primer grupo que tiene el estudiante,
la idea de hacer esto es evitar que al principio me lo muestre vacio

-Creado en el siderbar crearEscrito listará todos los desafios de todos los grupos que tiene el estudiante, los desafios
estan separados por pestañas en desafios individuales y colaborativos, donde el estudiante podra crear un escrito si la fecha
del desafio lo permite o si no hay un escrito creado anteriormente, si el escrito fue creado anteriormente o la fecha del desafio
ya paso, permanecerá desactivado el boton crearEscrito


-Creado en el siderbar "Escritos", listará todos los escritos de todos los grupos que tiene el estudiante,los escritos estan separados por pestañas en escritos 
individuales y colaborativos, donde podrá editar un escrito si todavía la fecha del desafío lo permite, y podrá ver un escrito si el escrito
ya fue corregido por el profesor.

-Creado en el sidebar de Equipos, listará todos los equipos de cada grupo que tiene el estudiante, pudiendo el estudiante gestionarlo
según el rol que disponga, si es lider o no, dependiendo si es lider podra eliminar un equipo o podra invitar a un estudiante,
o podra expulsar a un estudiante, una funcionalidad que tiene en comun tanto si es lider o no, es el poder abandonar el equipo.

-Otra funcionalidad hecha es que el profesor no puede editarEscritos que no son del profesor( o el desafio no 
pertenece al profesor), pero la idea correcta seria que el profesor no debe poder ver los escritos de desafios que no sean suyos, y eso Deberia
arreglarse, porque puede quitarle prioridad a los escritos que realmente son prioritarios, sobre todo si un alumno tiene muchos escritos

-Corregido todos los modales de reactStrap, utilizando modales de bootstrap.


Ficheros modificados

STUDENT

	sidebar Crear escrito,  para que me diferencia si lo hago desde el sidebar o desde el filtrado de grupos
	ChallengesStudent en el componentdidmount para que me diferencia si lo hago desde el sidebar o filtrado de grupos y corregido modal
	ChallengesTeam en el componentdidmount para que me diferencia si lo hago desde el sidebar o filtrado de grupos y corregido modal
	challengesTab contiene las pestañas de desafios Individuales y colaborativo

	EditWriting corregido  modal y que en el titulo me muestra si es un escrito colaborativo o individual
	EditWritingTeam corregido modal
	GroupStudent modificado para que me muestre el primer desafio del primer grupo en el sidebar grupos
	message corregido modal

	-Eliminado TabsChallenge,tabsWriting,TabsTeam, ahora solo se usa Tabs

	-Team(archivo renombrado) ahora me muestra todos los equipos de cada grupo del estudiante
	-TeamGroup corregido modal
	-TeamStudent en el componentdidmount para que me diferencia si lo hago desde el sidebar o filtrado de grupos y corregido modal
	-eliminado viewMultimedia
	-viewWriting corregido modal

	-writingsStudent en el componentdidmount para que me diferencia si lo hago desde el sidebar o filtrado de grupos y corregido modal,
	me muestra el nombreEscrito,desafioFinalizado, activa/desactiva boton ver/editarEscrito

	-writingsTeam en el componentdidmount para que me diferencia si lo hago desde el sidebar o filtrado de grupos y corregido modal,
	me muestra el nombreEscrito,desafioFinalizado, activa/desactiva boton ver/editarEscrito



TEACHER 

	-challenges corregido modal
	-EditWriting corregido modal
	-writingsStudent corregido bucle del componentDidUpdate 


LINKS 

	-linksStudent agregado crearEscrito,Escritos y equipos

RouterStudent
	-agregado rutas teams, writingsTabs,challengesTabs,TeamStudent


-student-Service 
	-getChallenges modificado, agregado un parametro como entrada type, la idea es poder reusar esta funcion tanto
	para desafios individuales y colaborativos
	- getWritings agregado esta funcion para que pueda obtener todos los escritos individuales
	de distintos grupos con solo el id del estudiante

	- getWritingsCollaborative agregado esta funcion para que pueda obtener todos los escritos colaborativos
	de distintos grupos con solo el id del estudiante

-Server 
	RouterStudent 
		-getChallenges modificado, agregado un parametro como entrada type, la idea es poder reusar esta funcion tanto
		para desafios individuales y colaborativos
		- getWritings agregado esta funcion para que pueda obtener todos los escritos individuales
		de distintos grupos con solo el id del estudiante

		- getWritingsCollaborative agregado esta funcion para que pueda obtener todos los escritos colaborativos
		de distintos grupos con solo el id del estudiante

	ControllerStudent
		-getChallenges modificado, agregado un parametro como entrada type, la idea es poder reusar esta funcion tanto
		para desafios individuales y colaborativos
		- getWritings agregado esta funcion para que pueda obtener todos los escritos individuales
		de distintos grupos con solo el id del estudiante

		- getWritingsCollaborative agregado esta funcion para que pueda obtener todos los escritos colaborativos
		de distintos grupos con solo el id del estudiante

	modelStudent
		-getChallenges modificado, agregado un parametro como entrada type, la idea es poder reusar esta funcion tanto
		para desafios individuales y colaborativos
		- getWritings agregado esta funcion para que pueda obtener todos los escritos individuales
		de distintos grupos con solo el id del estudiante

		- getWritingsCollaborative agregado esta funcion para que pueda obtener todos los escritos colaborativos
		de distintos grupos con solo el id del estudiante



