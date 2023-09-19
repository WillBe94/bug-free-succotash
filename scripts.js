const skill_list = 
[
	["Acrobatics","(Dex)"],
	["Animal Handling","(Wis)"],
	["Arcana","(Int)"],
	["Athletics","(Str)"],
	["Deception","(Cha)"],
	["History","(Int)"],
	["Insight","(Wis)"],
	["Intimidation","(Cha)"],
	["Investigation","(Int)"],
	["Medicine","(Wis)"],
	["Nature","(Int)"],
	["Perception","(Wis)"],
	["Performance","(Cha)"],
	["Persuasion","(Cha)"],
	["Religion","(Int)"],
	["Sleight of Hand","(Dex)"],
	["Stealth", "(Dex)"],
	["Survival", "(Wis)"]
];

const prof_bonus_dict = 
{
	 1:2,
	 2:2,
	 3:2,
	 4:2,
	 5:3,
	 6:3,
	 7:3,
	 8:3,
	 9:4,
	10:4,
	11:4,
	12:4,
	13:5,
	14:5,
	15:5,
	16:5,
	17:6,
	18:6,
	19:6,
	20:6,
};

document.addEventListener("load",init());

function init()
{
	//default ability scores to 10
	const ability_scores = document.querySelectorAll("input[data-ability-score]");
	for (let i=0; i<6; i++)
	{
		ability_scores[i].value=10;
	}

	//create skills
	generate_skills_table();

	//default level to 1
	const level = document.querySelector("input[data-level]");
	level.value="";
}

function generate_skills_table()
{
	//reference to the table element
	const table_element = document.getElementById("skill_table");

	for (let i=0; i<skill_list.length; i++)
	{
		//create row
		const current_skill = document.createElement("tr");
		table_element.appendChild(current_skill);
		
		
		//first column

			//skill name (td)
			skill_name = document.createElement("td");;
			skill_name.innerHTML=skill_list[i][0] + " ";
			skill_name.className="l";
			current_skill.appendChild(skill_name);

			//skill ability abbreviation span
			const skill_ability = document.createElement("span");
			skill_ability.className="skill_abilities";
			skill_ability.innerHTML=skill_list[i][1];
			skill_name.appendChild(skill_ability);
		
		//second column
			//table td thing
			const prof_td = document.createElement("td");
			prof_td.className="c";
			current_skill.appendChild(prof_td);

				//profiency checkbox
				const skill_proficiency = document.createElement("input");
				skill_proficiency.type = "checkbox";
				skill_proficiency.unchecked;
				skill_proficiency.setAttribute("id",skill_list[i][0].toLowerCase()+"_prof");
				skill_proficiency.setAttribute("data-proficient",skill_list[i][0].toLowerCase());
				skill_proficiency.setAttribute("onchange", "show_hide_expertise(this.id, this.checked); update_skill_prof(this.id, this.checked)");
				prof_td.appendChild(skill_proficiency);

		//third column
			//table td thing
			const exp_td = document.createElement("td");
			exp_td.className = "c";
			current_skill.appendChild(exp_td);

				//expertise checkbox
				const skill_expertise = document.createElement("input");
				skill_expertise.type = "checkbox";
				skill_expertise.setAttribute("id",skill_list[i][0].toLowerCase()+"_exp");
				skill_expertise.setAttribute("data-expertise",false);
				skill_expertise.className = "inv";
				skill_expertise.setAttribute("onchange", "update_skill_exp(this.id, this.checked);");
				exp_td.appendChild(skill_expertise);

		//fourth column
			//proficiency bonus (td)
			const prof_bonus_td = document.createElement("td");
			prof_bonus_td.className = "c";
			prof_bonus_td.id = skill_list[i][0].toLowerCase();
			prof_bonus_td.innerHTML = 0;
			current_skill.appendChild(prof_bonus_td);
	}
}

function show_hide_expertise(expertise, value)
{
	expertise = expertise.slice(0,-4)+"exp";
	const element = document.getElementById(expertise);
	if(value)
	{
		element.className="vis";
	}
	else
	{
		element.className="inv";
	}
}

function prof_bonus()
{
	const level_element = document.getElementById("character_level");
	const prof_bonus_element = document.getElementById("prof_bonus");
	const class_elements=document.querySelectorAll("input[data-level]");

	let total=0;

	for(let i=0; i<class_elements.length; i++)
	{
		total+=Number(class_elements[i].value);
	}
	
	if(total < 1)
	{
		total=1
	}

	if(total > 20)
	{
		total=20;
	}

	level_element.innerHTML=total;
	prof_bonus_element.innerHTML= prof_bonus_dict[total];

}

function addClass()
{
	//fetch stuff
	const list = document.querySelectorAll("input[data-class]");
	//console.log(list.length);
	//console.log(list);
	const next_index = list.length/3;
	const last_element = list[next_index];
	const end_of_list = document.getElementById("class_list");
	
	//create new stuff
	const new_class = document.createElement("input");
	const new_class_level = document.createElement("input");
	const remove_button = document.createElement("input");
	
	//polish off new stuff
	new_class.type="text";
	new_class.placeholder="Class";
	new_class.setAttribute("data-class", next_index);

	new_class_level.type="number";
	new_class_level.min="1";
	new_class_level.max="20";
	new_class_level.setAttribute("data-class", next_index);
	new_class_level.setAttribute("data-level","");
	new_class_level.placeholder="1";
	new_class_level.setAttribute("onchange","prof_bonus();");

	remove_button.type = "button";
	remove_button.setAttribute("data-class", next_index);
	remove_button.setAttribute("onclick", "removeClass("+next_index+");");
	remove_button.value="Remove";

	//slot new stuff into old stuff
	end_of_list.appendChild(new_class);
	end_of_list.appendChild(new_class_level);
	end_of_list.appendChild(remove_button);
}

function removeClass(index)
{
	let list = document.querySelectorAll("[data-class]");
	//console.log(list);
	for (let i=0; i<list.length; i++)
	{
		if (list[i].getAttribute("data-class")==index)
		{
			if(list[i].type=="number")
			{
				let element = document.getElementById("character_level");
				element.innerHTML -= Number(list[i].value);
			}
			list[i].remove();
		}
	}

	list = document.querySelectorAll("[data-class]");
	for (let i = index*3; i < list.length; i++)
	{
		let new_index = list[i].getAttribute("data-class")-1;
		list[i].setAttribute("data-class",new_index);
		if(list[i].type=="button")
		{
			list[i].setAttribute("onclick","removeClass("+(new_index)+");");
		}
	}
}

function ability_mod(score, ability)
{
	const ability_mod_element = document.getElementById(ability+"_mod");
	const modifier = Math.floor((score-10)/2);
	ability_mod_element.innerHTML = modifier;
}

function update_skill_prof_bonus()
{
	//console.log(skill_name);
	const prof_list = document.querySelectorAll("input[data-proficient]");
	const exp_list = document.querySelectorAll("input[data-expertise");
	const prof_bonus = document.getElementById("prof_bonus").innerHTML;
	for(let i=0; i<prof_list.length; i++)
	{
		const skill_name=prof_list[i].getAttribute("data-proficient");
		//console.log(skill_name);
		//prof_list[i].parentElement;
		let skill_bonus = document.getElementById(skill_name).innerHTML;
		if(prof_list[i].checked)
		{
			skill_bonus = Number(prof_bonus);
			if(exp_list[i].checked)
			{
				skill_bonus = Number(skill_bonus)+Number(prof_bonus);
			}
		}
		else
		{
			//Somehow reset to just relevant ability mod
		}
	}
}

function update_skill_ability(ability_mod)
{

}

function update_skill_prof(skill, checked)
{
	const skill_name = skill.slice(0,-5);
	const element = document.getElementById(skill_name);
	const prof_bonus = document.getElementById("prof_bonus");
	
	if(checked)
	{
		element.innerHTML = Number(element.innerHTML) + Number(prof_bonus.innerHTML);
	}
	else
	{
		element.innerHTML = Number(element.innerHTML) - Number(prof_bonus.innerHTML);
	}
}

function update_skill_exp(skill, checked)
{
	const skill_name = skill.slice(0,-4);
	//console.log(skill_name);
	
	const element = document.getElementById(skill_name);
	const prof_bonus = document.getElementById("prof_bonus");
	
	if(checked)
	{
		element.innerHTML = Number(element.innerHTML) + Number(prof_bonus.innerHTML);

	}
	else
	{
		element.innerHTML = Number(element.innerHTML) - Number(prof_bonus.innerHTML);
	}
	
	if(Number(element.innerHTML)<0)
	{
		element.innerHTML=0;
	}
	
}

function parenth_to_lower(list_entry)
{
	return list_entry.substring(1,4).toLowerCase();
}