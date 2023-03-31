import React from 'react'
import { StyleSheet, Text, View, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'


const StoryUI = (props) => {

    const colors = props.colors
    
    return(
        <View style={{ ...styles.story }}>
            <View style={{ ...styles.storyUiOuter, borderColor: colors.blue, backgroundColor: colors.bgPrimary }}>
                <View style={{ ...styles.storyui }}></View>
            </View>
            <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Text style={{ ...styles.storyText }} numberOfLines={1} ellipsizeMode={'tail'} >Braz Suthar</Text>
            </View>
        </View>
    )
}


export default function Story(props) {

    const colors = props.colors

    return(
        <View style={{ ...styles.mainContainer }}>
            <View style={{ ...styles.header }}>
                <Text style={{ ...styles.headerText, color: colors.textPrimary }}>Story</Text>
                <Ionicons name={'ios-add-outline'} size={ 32 } style={{ color: colors.blue, fontWeight: 'bold' }} />
            </View>
            <ScrollView style={{ paddingStart: 15, paddingEnd: 15 }} showsHorizontalScrollIndicator={false} contentInset={20} contentInsetAdjustmentBehavior={'scrollableAxes'} horizontal={true} alwaysBounceHorizontal={true}>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <View style={{ width: 15 }}></View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    story: {
        width: 80,
        height: 120,
        marginRight: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    storyUiOuter: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderStyle: 'solid',
        borderWidth: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    storyui: {
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 50,
    },
    storyText: {
        marginTop: 5,
    }
})