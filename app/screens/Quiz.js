import React, { useCallback, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Modal, Animated, TextInput } from 'react-native'
import { COLORS, SIZES } from '../constants';
// import data from '../data/QuizData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import emailService from './email-service';

const Quiz = () => {
   
    var data=undefined;
    // const getdata = async () => {
    //     let apiUrl = `https://opentdb.com/api.php?amount=10`
    //     await fetch(apiUrl)
    //       .then((res) => res.json())
    //       .then((response) => {
    //         console.log("2============>"+response.results)
    //         data=response.results;
    //       })
    //   }
    // getdata();
    // console.log("3======================>")
    data =  [
        {
            question: "What’s the biggest planet in our solar system?",
            incorrect_answers: ["Jupiter","Saturn","Neptune","Mercury"],
            correct_answer: "Jupiter"
        },
        {
            question: "What attraction in India is one of the famus in the world?",
            incorrect_answers: ["Chand Minar","Taj Mahal","Stadium","Neptune"],
            correct_answer: "Taj Mahal"
        },
        {
            question: "What land animal can open its mouth the widest?",
            incorrect_answers: ["Alligator","Crocodile","Baboon","Hippo"],
            correct_answer: "Hippo"
        },
        {
            question: "What is the largest animal on Earth?",
            incorrect_answers: ["The African elephant","The blue whale","The sperm whale","The giant squid"],
            correct_answer: "The blue whale"
        },
        {
            question: "What is the only flying mammal?",
            incorrect_answers: ["The bat","The flying squirrel","The bald eagle","The colugo"],
            correct_answer: "The bat"
        }
    ]
    
    const [allQuestions, setallQuestions] = useState(shuffle(data))
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [correctOption, setCorrectOption] = useState(null);
    const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
    const [score, setScore] = useState(0)
    const [showNextButton, setShowNextButton] = useState(false)
    const [showScoreModal, setShowScoreModal] = useState(false)
    const [showEmailModel, setshowEmailModel] = useState(false)
    const [myArray, setMyArray] = useState([]);
    const [myValue, setMyValue] = useState([]);
    const [email, setEmail] = useState('');

    const sendEmail = () => {
        console.log(email)
        var data = {
            to_email:email,
            to_name:email,
            message:"Your Score is "+score
          };

        emailService.sendEmail(data)
        setshowEmailModel(false)
        setShowScoreModal(true)
      };

    // const myArray = [];
    // myArray.push("10")
    // console.log("myValue=====>",myValue)
    // console.log("my=====>",myArray)
    // console.log("Lenth==>",myArray.length);
    // visitedQuestionList = (value) => {
    //     this.setState({ storeArr: value - this.state.storeArr.length >= 0
    //         ? [...this.state.storeArr, ...Array(value - this.state.storeArr.length).fill('')]
    //         : this.state.storeArr.filter((_, index) => index <= value)
    //     });
    // };
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    // const getNumber = async () =>{
    //     const r=Math.floor(Math.random()*(5)+1);
    //     if(myValue.includes(r)){
    //         await getNumber()
    //     }else{
    //         setMyValue(oldValue => [...oldValue, r]);
    //         return r;
    //     }
    // }

    const validateAnswer = (selectedOption) => {
        // console.log("selectedOption==>",selectedOption)
        let correct_option = allQuestions[currentQuestionIndex]['correct_answer'];
        setCurrentOptionSelected(selectedOption);
        setCorrectOption(correct_option);
        setIsOptionsDisabled(true);
        if(selectedOption==correct_option){
            // Set Score
            setScore(score+1)
        }
        // Show Next Button
        setShowNextButton(true)
    }
    const handleNext = () => {
        setMyArray(oldArray => [...oldArray, allQuestions[currentQuestionIndex]?.question]);
        if(currentQuestionIndex== allQuestions.length-1){
            // Last Question
            // Show Score Modal
            setshowEmailModel(true)
            // setShowScoreModal(true)
        }else{
            setMyValue(oldValue => [...oldValue, Math.floor(Math.random()*(5-0+1)+1)]);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            setShowNextButton(false);
        }
        Animated.timing(progress, {
            toValue: currentQuestionIndex+1,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }
    const restartQuiz = () => {
        setMyArray([]);
        setMyValue([]);
        setallQuestions([]);
        setallQuestions(shuffle(data))
        // setshowEmailModel(false);
        setShowScoreModal(false);
        setCurrentQuestionIndex(0);
        setScore(0);

        setCurrentOptionSelected(null);
        setCorrectOption(null);
        setIsOptionsDisabled(false);
        setShowNextButton(false);
        Animated.timing(progress, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }



    const renderQuestion = () => {
        return (
            <View style={{
                marginVertical: 40
            }}>
                {/* Question Counter */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end'
                }}>
                    <Text style={{color: COLORS.white, fontSize: 20, opacity: 0.6, marginRight: 2}}>{myArray.length+1}</Text>
                    <Text style={{color: COLORS.white, fontSize: 18, opacity: 0.6}}>/ {allQuestions.length}</Text>
                </View>

                {/* Question */}
                <Text style={{
                    color: COLORS.white,
                    fontSize: 15
                }}>{allQuestions[currentQuestionIndex]?.question}</Text>
            </View>
        )
    }
    const renderOptions = () => {
        return (
            <View>
                {
                    allQuestions[currentQuestionIndex]?.incorrect_answers.map(option => (
                        <TouchableOpacity 
                        onPress={()=> validateAnswer(option)}
                        disabled={isOptionsDisabled}
                        key={option}
                        style={{
                            borderWidth: 2, 
                            borderColor: option==correctOption 
                            ? COLORS.success
                            : option==currentOptionSelected 
                            ? COLORS.error 
                            : COLORS.secondary+'40',
                            backgroundColor: option==correctOption 
                            ? COLORS.success +'20'
                            : option==currentOptionSelected 
                            ? COLORS.error +'20'
                            : COLORS.secondary+'20',
                            height: 40, borderRadius: 20,
                            flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            marginVertical: 10
                        }}
                        >
                            <Text style={{fontSize: 10, color: COLORS.white}}>{option}</Text>

                            {/* Show Check Or Cross Icon based on correct answer*/}
                            {
                                option==correctOption ? (
                                    <View style={{
                                        width: 10, height: 10, borderRadius: 30/2,
                                        backgroundColor: COLORS.success,
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <MaterialCommunityIcons name="check" style={{
                                            color: COLORS.white,
                                            fontSize: 10
                                        }} />
                                    </View>
                                ): option == currentOptionSelected ? (
                                    <View style={{
                                        width: 10, height: 10, borderRadius: 30/2,
                                        backgroundColor: COLORS.error,
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <MaterialCommunityIcons name="close" style={{
                                            color: COLORS.white,
                                            fontSize: 10
                                        }} />
                                    </View>
                                ) : null
                            }

                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    }
    const renderNextButton = () => {
        if(showNextButton){
            return (
                <TouchableOpacity
                onPress={handleNext}
                style={{
                    marginTop: 20, width: '100%', backgroundColor: COLORS.accent, padding: 10, borderRadius: 5
                }}>
                    <Text style={{fontSize: 10, color: COLORS.white, textAlign: 'center'}}>Next</Text>
                </TouchableOpacity>
            )
        }else{
            return null
        }
    }


    const [progress, setProgress] = useState(new Animated.Value(0));
    const progressAnim = progress.interpolate({
        inputRange: [0, allQuestions.length],
        outputRange: ['0%','100%']
    })
    const renderProgressBar = () => {
        return (
            <View style={{
                width: '100%',
                height: 20,
                borderRadius: 20,
                backgroundColor: '#00000020',

            }}>
                <Animated.View style={[{
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: COLORS.accent
                },{
                    width: progressAnim
                }]}>

                </Animated.View>

            </View>
        )
    }


    return (
       <SafeAreaView style={{
           flex: 1
       }}>
           <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
           <View style={{
               flex: 1,
               paddingVertical: 40,
               paddingHorizontal: 16,
               backgroundColor: COLORS.background,
               position:'relative'
           }}>

               {/* ProgressBar */}
               { renderProgressBar() }

               {/* Question */}
               {renderQuestion()}

               {/* Options */}
               {renderOptions()}

               {/* Next Button */}
               {renderNextButton()}

               {/* Email Modal */}
               <Modal
               animationType="slide"
               visible={showEmailModel}
               >
                   <View 
                   style={{
                       flex: 1,
                       backgroundColor: COLORS.primary,
                       alignItems: 'center',
                       justifyContent: 'center'
                   }}>
                       <View style={{
                           backgroundColor: COLORS.white,
                           width: '90%',
                           height:'40%',
                           borderRadius: 20,
                           padding: 20,
                           alignItems: 'center'
                       }}>
                            <View style={{
                                        height:50,
                                        width:300,
                                        marginVertical:30
                                    }}>
                                <Text>
                                    Enter Your Email Address To get Score on Email
                                </Text>
                                <View style={{
                                        backgroundColor: COLORS.black,
                                        height:40
                                    }}>
                                    <TextInput style={{textAlign: 'center',background: COLORS.black, width: '100%',height: '100%', color: COLORS.white, fontSize: 10
                                    }}
                                        onChangeText={setEmail}
                                        value={email}
                                        multiline={true}
                                        borderColor={COLORS.black}
                                    />
                                </View>
                            </View>
                           {/* Retry Quiz button */}
                           <TouchableOpacity
                           onPress={sendEmail}
                           style={{
                               backgroundColor: COLORS.accent,
                               
                               padding: 20, borderRadius: 5
                           }}>
                               <Text style={{
                                   textAlign: 'center', color: COLORS.white, fontSize: 10,
                                   
                               }}>Save Email</Text>
                           </TouchableOpacity>

                       </View>

                   </View>
               </Modal>

               {/* Score Modal */}
               <Modal
               animationType="slide"
               transparent={true}
               visible={showScoreModal}
               >
                   <View style={{
                       flex: 1,
                       backgroundColor: COLORS.primary,
                       alignItems: 'center',
                       justifyContent: 'center'
                   }}>
                       <View style={{
                           backgroundColor: COLORS.white,
                           width: '90%',
                           borderRadius: 20,
                           padding: 20,
                           alignItems: 'center'
                       }}>
                           <Text style={{fontSize: 30, fontWeight: 'bold'}}>{ score> (allQuestions.length/2) ? 'Congratulations!' : 'Oops!' }</Text>

                           <View style={{
                               flexDirection: 'row',
                               justifyContent: 'flex-start',
                               alignItems: 'center',
                               marginVertical: 20
                           }}>
                               <Text style={{
                                   fontSize: 30,
                                   color: score> (allQuestions.length/2) ? COLORS.success : COLORS.error
                               }}>{score}</Text>
                                <Text style={{
                                    fontSize: 20, color: COLORS.black
                                }}>/ { allQuestions.length }</Text>
                           </View>
                           {/* Retry Quiz button */}
                           <TouchableOpacity
                           onPress={restartQuiz}
                           style={{
                               backgroundColor: COLORS.accent,
                               padding: 20, width: '100%', borderRadius: 20
                           }}>
                               <Text style={{
                                   textAlign: 'center', color: COLORS.white, fontSize: 20
                               }}>Retry Quiz</Text>
                           </TouchableOpacity>

                       </View>

                   </View>
               </Modal>

               {/* Background Image */}
               <Image
                source={require('../assets/images/DottedBG.png')}
                style={{
                    width: SIZES.width,
                    height: 130,
                    zIndex: -1,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    opacity: 0.5
                }}
                resizeMode={'contain'}
                />

           </View>
       </SafeAreaView>
    )
}

export default Quiz
