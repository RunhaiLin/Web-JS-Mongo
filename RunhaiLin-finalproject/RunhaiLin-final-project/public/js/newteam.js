document.addEventListener('DOMContentLoaded', main);

function main(){
	const addbutton = document.querySelector("#newteamsubmit");
	addbutton.addEventListener('click',function(evt){
		evt.preventDefault();

		const allcheckbox = document.querySelectorAll("#monstercheckbox");
		let numberofchecked = 0;
		for (let i = 0;i<allcheckbox.length;i++){
			if (allcheckbox[i].checked){
				numberofchecked++;
			}
		}

		console.log(numberofchecked);
		
		if (numberofchecked!=6){
			alert("The monsters selected should be 6");
		} else{
			const teamform = document.querySelector("#teamform");
			teamform.submit();
		}
		

	})
}