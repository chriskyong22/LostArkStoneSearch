import React, { useEffect, useState } from "react";
import Select from 'react-select';
import '../App.css';
import popularBuilds from "../data/popular_builds";
import engravingsList from "../data/engravings_list";
import intToNth from "../helperFunctions/intToNth";
import { useSelector } from "react-redux"

function nameToEngravingObject(name) {
    return { label: name, value: name }
}

const engravings = []

engravingsList.forEach(engraingName => {
    engravings.push(nameToEngravingObject(engraingName))
})

const defaultSelectedOptions = { formOne: null, formTwo: null }

function EngravingSearch() {

    const darkModeRedux = useSelector(state => state.darkmodeReducer)

    const [selectedOptions, setSelectedOptions] = useState(defaultSelectedOptions)
    const [perfectMatchList, setPerfectMatchList] = useState([])
    const [partialMatchList, setPartialMatchList] = useState([])
    const [noMatches, setNoMatches] = useState(false)

    const onChange = (incomingSelected, e) => {
        setSelectedOptions({
            ...selectedOptions,
            [e.name]: incomingSelected
        })
    }

    const onSubmit = () => {
        const tempPerfectMatchList = [];
        const tempPartialMatchList = [];

        popularBuilds.map((build) => {
            if (build.build_engravings.includes(selectedOptions.formOne.value) && build.build_engravings.includes(selectedOptions.formTwo.value)) {
                const engravingOneImportance = build.build_engravings.findIndex((e) => e === selectedOptions.formOne.value)
                const engravingTwoImportance = build.build_engravings.findIndex((e) => e === selectedOptions.formTwo.value)
                console.log("ENG2IMP", engravingTwoImportance)
                if (engravingOneImportance < engravingTwoImportance) {
                    return tempPerfectMatchList.push({
                        ...build,
                        matchedEngravingOne: selectedOptions.formOne.value,
                        matchedEngravingTwo: selectedOptions.formTwo.value,
                        engravingPriorityOne: parseInt(engravingOneImportance),
                        engravingPriorityTwo: parseInt(engravingTwoImportance)
                    })
                } else {
                    return tempPerfectMatchList.push({
                        ...build,
                        matchedEngravingOne: selectedOptions.formTwo.value,
                        matchedEngravingTwo: selectedOptions.formOne.value,
                        engravingPriorityOne: parseInt(engravingTwoImportance),
                        engravingPriorityTwo: parseInt(engravingOneImportance)
                    })
                }

            } else if (build.build_engravings.includes(selectedOptions.formOne.value)) {
                const importance = build.build_engravings.findIndex((e) => e === selectedOptions.formOne.value)

                return tempPartialMatchList.push({
                    ...build,
                    matchedEngraving: selectedOptions.formOne.value,
                    engravingPriority: parseInt(importance)
                })
            } else if (build.build_engravings.includes(selectedOptions.formTwo.value)) {
                const importance = build.build_engravings.findIndex((e) => e === selectedOptions.formTwo.value)

                return tempPartialMatchList.push({
                    ...build,
                    matchedEngraving: selectedOptions.formTwo.value,
                    engravingPriority: parseInt(importance)
                })
            }
        })
        tempPerfectMatchList.sort((a, b) => (a.engravingPriorityOne > b.engravingPriorityOne) ? 1 : -1)
        tempPartialMatchList.sort((a, b) => (a.engravingPriority > b.engravingPriority) ? 1 : -1)

        setPerfectMatchList(tempPerfectMatchList)
        setPartialMatchList(tempPartialMatchList)

        console.log(tempPartialMatchList, tempPerfectMatchList)
        if (tempPerfectMatchList.length === 0 && tempPartialMatchList.length === 0) {
            setNoMatches(true)
        } else {
            setNoMatches(false)
        }
    }

    return (
        <div className="engraving-search-component">
            <h2 className="note">Now with Darkmode!</h2>
            <div className="forms">
                <Select
                    options={engravings} 
                    onChange={(inc, e) => onChange(inc, e)} 
                    name="formOne"
                />
                <Select
                    options={engravings} 
                    onChange={onChange} 
                    name="formTwo"
                />
                <button 
                    className="searchBtn"
                    onClick={onSubmit}
                >
                    Search
                </button>
            </div>
            <div className="results">
                <h2 style={{textAlign: "center"}}>
                    {"Perfect Matches: "}
                        <span style={{color: "#FFD700"}}>
                            {perfectMatchList.length}
                        </span>
                </h2>
                {
                    perfectMatchList.map((build) => {
                        return (<table className="engravingsTable">
                            <thead>
                                <tr>
                                    <th colSpan={2}>
                                        <span className="perfect-match">
                                            {build.build_name}
                                        </span>
                                        <span className="build-stats">
                                            {` [${build.primary_stat}/${build.secondary_stat}]`}
                                        </span>
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        Engraving
                                    </th>
                                    <th>
                                        Priority
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className={darkModeRedux ? "perfect-match-engraving-darkmode" : "perfect-match-engraving"}>
                                            {build.matchedEngravingOne}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={darkModeRedux ? `importance-${build.engravingPriorityOne} importance-dark` : `importance-${build.engravingPriorityOne}`}>
                                            {intToNth(build.engravingPriorityOne)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={darkModeRedux ? "perfect-match-engraving-darkmode" : "perfect-match-engraving"}>
                                            {build.matchedEngravingTwo}
                                        </span> 
                                    </td>
                                    <td>
                                        <span className={darkModeRedux ? `importance-${build.engravingPriorityTwo} importance-dark` : `importance-${build.engravingPriorityTwo}`}>
                                            {intToNth(build.engravingPriorityTwo)}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>)
                    })
                }
                <h2 style={{textAlign: "center"}}>
                    {`Partial Matches: `}
                    <span style={{color: "red"}}>
                        {partialMatchList.length}
                    </span>
                </h2>
                {
                    partialMatchList.map((build) => {
                        return (
                        <table className="engravingsTable">
                            <thead>
                                <tr>
                                    <th colSpan={2}>
                                        <span className="partial-match">
                                            {build.build_name}
                                        </span>
                                        <span className="build-stats">
                                            {` [${build.primary_stat}/${build.secondary_stat}]`}
                                        </span>
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        Engraving
                                    </th>
                                    <th>
                                        Priority
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {build.matchedEngraving}
                                    </td>
                                    <td>
                                        <span className={darkModeRedux ? `importance-${build.engravingPriority} importance-dark` : `importance-${build.engravingPriority}`}>
                                            {intToNth(build.engravingPriority)}
                                        </span>
                                    </td>
                                </tr>

                            </tbody>
                        </table>)
                    })
                }
                {
                    noMatches ? <h2 className="no-matches">No Matches</h2> : ""
                }
            </div>
        </div>
    )
}

export default EngravingSearch