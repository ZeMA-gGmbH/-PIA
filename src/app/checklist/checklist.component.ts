import { Component, OnInit,  Injectable, AfterViewInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

/**
 * Node for to-do item
 */
 export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

/**
 * The Json object for to-do list data.
 * When you add/change a node in  TREE_DATA json, also add atleast the name of the node in the 'id' of NODE_DATA json to prevent the app from crashing.
 */
const TREE_DATA = {
  'Preparation and project planning': {
    'Thoroughly read and understood the checklist': null,
    'Objectives and nature of the project defined': null,
    'Experts identified ': null,
    'Archive checked for similar projects': null,
    'Overview of possible products, processes, and plants created':null,
    'Effort realistically estimated':null,
    'Focus of observation defined':null,
    'Schedule created ':null,
    'Work packages derived and divided':null,
    'Coordination and responsibilities clarified':null,
    'Employees educated and commitment obtained':null,
    'Specifications created':null,
  },
  'Measurement and data planning': {
    'Build up and use process knowledge':{
      'Already existing features identified':null,
      'Quality requirements identified':null,
      'Cause-effect diagram created':null,
      'Interference variables identified and their influence determined':null,
      'Influence of interference variables minimized':null,
      'The use of additional sensors considered':null,
      'Overview of sensors created':null
    },
    'Use norms and standards':{
      'Internal standards researched':null,
      'External standards and norms researched':null,
    },
    'Structure of the data':{
      'Data format selected':null,
      'Data structure selected':null,
      'Unique naming of the data selected':null,
      'Descriptive naming of the data selected':null,
      'Automatic annotation of the data ensured':null,
      'A clear relationship between the data to the individual products established':null,
      'Metadata to be recorded selected':null,
      'Comprehensible description of the metadata selected':null,
      'Format of time stamps defined and documented':null,
      'Reference systems adapted and documented':null,
      'Label reference runs and test measurements':null,
      'Storage of threshold values':null,
      'Clear definition of measured values and critical figures provided':null,
      'Non-digital knowledge or data digitized':null,
    },
    'Data storage':{
      'Existing data collection systems integrated':null,
      'Storage requirements estimated':null,
      'Suitable platform for data storage selected':null,
      'Data back-up selected':null,
    },
    'Integrate manually collected data':{
      'Human influence reduced':null,
      'Digital shift books introduced':null,
      'Documentation of all state changes ensured':null,
      'Images integrated as an additional data source':null,
      'Allows mapping of manual data to automated data':null
    }
    
  },
  'Data acquisition':{
    'First test measurement and data quality check':{
      'Test measurements carried out':null,
      'Data structure checked':null,
      'Proper function of the sensors checked':null,
      'Synchronization of the data acquisition systems ensured':null,
      'Assignment of data to processes and products ensured':null,
      'Data quality evaluated':null
    },
    'Long-term data recording':{
      'Inspection intervals set':null,
      'Proper function of the sensors checked':null,
      'Statistical significance tested':null,
      'First data analysis carried out':null
    }
  },
  'Data check and data cleansing':{
    'Data structure checked again':null,
    'Missing information added':null,
    'Data combined':null,
    'Blind spots identified':null,
    'Data cleansed of invalid measurements':null,
    'References and zero points adjusted':null,
    'Reference runs and test measurements separated':null,
    'Outliers removed from the evaluation':null,
    'Units checked and unified':null,
    'Distribution shift balanced':null,
    'Data cleansing documented':null
  },
  'Data evaluation and modeling':{
    'Data understanding':{
      'Suitable time scale selected for visualization':null,
      'Signal curves plotted in the time series diagram':null,
      'Quasi-static signals plotted':null,
      'Histograms plotted':null,
      'Boxplot diagram plotted':null,
      'Principal component analysis performed':null,
      'Error patterns examined and interpreted':null
    },
    'Selection of machine learning algorithms':{
      'State-of-the-art reviewed':null,
      'Available computing power checked':null,
      'Learning problem defined':null,
      'Suitable and realistic validation scenario selected':null,
      'Feature extraction algorithms selected':null,
      'Feature selection algorithms selected':null,
      'Algorithms for classification or regression selected':null,
      'Additional anomaly detection applied':null
    },
    'Modeling':{
      'Performance of the machine learning algorithms compared':null,
      'Suitable learning algorithms selected':null,
      'Model uploaded for application':null,
      'Model controlled':null
    },
    'Model application':{
      'Regular validation of the model scheduled':null,
      'Regular re-training of the model scheduled':null,
      'Hardware and software changes documented':null
    }

  },
  'Project completion':{
    'Analysis results compared with the initial objective of the analysis':null,
    'Lessons learned formulated':null,
    'Final presentation created':null,
    'Final report drafted':null,
    'All documents centrally stored':null
  }
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);
    console.log(data);
    
    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
   buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

export class commentDefinition{
  constructor(public nodeId: string , public comment: string){}
}

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers: [ChecklistDatabase]
})

export class ChecklistComponent implements OnInit, AfterViewInit {

  //comment: any
//
  //commentAdded(){
  //  console.log('comment;', this.comment)
  //}
  ngOnInit(): void {
  }
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(private database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }
  ngAfterViewInit(): void {
    //this.nodeData
  }
  
  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }
  
  /**
   * Implementation of the logic to display the info of each node in the checklist.
   */
  data: string = ''
  isNodeClicked: Boolean = false
  istippPresent: Boolean = true
  isHienweispresent: Boolean = true
  isInfoPresent: Boolean = true
  nodeData:any =[]
  nodeID: string = ''
  commentData:any = []

  @ViewChild('comment') commentToAdd: ElementRef

  comments: commentDefinition[] = []
  filteredComments: any = []

  onAddComment(){
    var commentInput = this.commentToAdd.nativeElement.value;
    var newComment = new commentDefinition(this.nodeID , commentInput)
    this.comments.push(newComment) //push new comments to array
    this.commentToAdd.nativeElement.value =''
    //console.log(this.comments[0].nodeId)
    for(var i=0; i < this.comments.length; i++){
    //  console.log('length',i)
    //  console.log('type', typeof this.comments)
    console.log('length of comments array is:', this.comments.length)
    console.log('xyz',this.comments[i])
    //  if (this.comments[i].nodeId == this.nodeID){
    //    this.filteredComments.push(this.comments[i].comment)
      }  
    //this.filterData()  
     // this.filter()
    //   
    //}
    //filter the comments according to the selected node.

    //console.log('we are at node:',this.nodeID,'comment is:',this.commentToAdd.nativeElement.value)
  }

  filter(){
    var node = this.nodeID
    console.log('comments array before new filter:', this.comments)
    var filtered = this.comments.filter(function(comment){
      return comment.nodeId == node;
    })
  this.filteredComments.push(filtered)
    console.log('filtered data with new method:', filtered)
  }
  filterData(){
    for(var i=0; i < this.comments.length; i++){
      let filter:any = []
      //console.log('length',i)
      //console.log('type', typeof this.comments)
      //console.log('xyz',this.comments[i].nodeId)
      if (this.comments[i].nodeId == this.nodeID){
        console.log('node ID in comments is ', this.comments[i].nodeId)
        console.log('node ID in button is ', this.nodeID)
        console.log('The comment in the true case is:',this.comments[i].comment)
        //this.filteredComments.push(this.comments[i].comment)
        filter.push(this.comments[i].comment)
        this.filteredComments = filter
      } 
    console.log('the node ID is:',this.nodeID,'filtered comments are:',this.filteredComments)
  }
  }
    
  //present in two places in HTML, one for main node, other for subnode in the main structure!
  onClicked(data:string){
   // this.filter()
    //console.log('comments array after changing node:',this.comments)
    //this.filterData()
    var empty:any = []
    this.comments = empty
   try {
    this.isNodeClicked= true;
    [this.nodeData , this.nodeID]  =  this.searchNodeInfo(data, NODE_DATA)
    //console.log('ID of the selected node is:',this.nodeID)
    console.log(this.nodeData[0].info)


    var tipp = this.nodeData[0].tipp
    if (tipp === "") {

      this.istippPresent = false
    }
    else{
      this.istippPresent = true
    }

    var hinweis = this.nodeData[0].hinweis
    if (hinweis === "") {
      this.isHienweispresent = false
      
    } else {
      this.isHienweispresent = true
    }

    var info = this.nodeData[0].info

    if(info === ""){
      this.isInfoPresent = false
    }else{
      this.isInfoPresent = true
    }
    


    }
    catch(e){
    //need to implement try catch to avoid exception of any node info not added, then the app shouldnt give an error in console.
    }
  }
  
  searchNodeInfo(nodeData: string, data: any){
    var filteredData:any = []
    var nodeID:string = nodeData
    nodeData = nodeData.toLowerCase();
    console.log('json length is:',data.length)
    for(var i=0; i < data.length; i++){
      var id = data[i].id.toLowerCase()
      if (id === nodeData){
        filteredData.push(data[i])
        //console.log('collected data is:',filteredData)
      }
    }
    return [filteredData , nodeID]
  }

 
}


/**
   * JSON containing information about the checklist cmponents
   * Structure: Name of the node(Please try to put the name exaxctly as in the Json above to build the treeview TREE_DATA)
   *            Info, hinweise,tipp
   * any of the respective fields might be empty.
   * 
   *   blueprint:
   *      {'id':'', 
           'info': '',
           'hinweis': '',
           'tipp':''
            },
   */

const NODE_DATA =[
  //1
  {'id':'Preparation and project planning', 
    'info': 'Already during the preparation, there are several aspects to consider in creating a good starting point for your project. Although the following points seem trivial, experience shows that they are often neglected in practice. Even though usually much production data already exists in the company, good preparation is essential to move your project forward successfully. Within the framework of this checklist, only points of project management that are critical for data quality are mentioned. Other important points, such as budget planning or risk analysis, should still be considered.',
    'hinweis': '',
    'tipp':''
  },
          {'id':'Thoroughly read and understood the checklist', 
           'info': 'Before you start processing, you should have read the checklist entirely and understood the individual work steps. ',
           'hinweis': 'Testhinweis',
           'tipp':'Testtipp'
          },
          {'id':'Objectives and nature of the project defined', 
          'info': 'Think carefully, ideally in a cross-departmental meeting with process experts, about your projects goals. Do you, for example, want to monitor the condition of products, processes, or plants? Do you want to record data specifically at only one plant, or do you want to record data across stations or plants? Do you want to optimize the processes with the most downtime or reject them?   ',
          'hinweis': 'Machine learning is built on statistical analysis and can only provide meaningful results if the information you are looking for is contained in the data.  ',
          'tipp':''
          },
          {'id':'Experts identified ', 
           'info': 'Try to identify the respective experts for your products, processes, and plants and convince them of your project. Expert knowledge is precious for planning, evaluating, and interpreting your data.',
           'hinweis': 'Often, (specific) process knowledge can only be found among individuals in the company and is thus difficult to access, which can enormously hinder data evaluation and analysis. ',
           'tipp':''
            },
           {'id':'Archive checked for similar projects', 
          'info': 'Before you start planning, check whether similar projects have already been carried out in your company (or your sector). If so, look at the available project documentation and try to incorporate what you have learned from those projects into the current project. ',
          'hinweis': '',
          'tipp':''
           },
           {'id':'Overview of possible products, processes, and plants created', 
           'info': 'Create an overview of the products, (assembly) processes, and plants that come into question for your analysis. ',
           'hinweis': '',
           'tipp':''
            },
            {'id':'Effort realistically estimated', 
           'info': 'The most effort in analyzing data in machine learning is in the preparation of the data (approx. 80%) and only 20% in the actual analysis. Especially the communication with the experts who are only available sporadically and are not directly included in the project can delay the schedule. ',
           'hinweis': '',
           'tipp':''
            },
            {'id':'Focus of observation defined', 
           'info': 'Try to keep your focus of observation as small as possible. Bundle your resources and do not get lost in evaluating data from too large and complex plants. Instead, start small, e.g., with a single (critical) process, and expand your analysis later. ',
           'hinweis': '',
           'tipp':''
            },
            {'id':'Schedule created ', 
           'info': 'By when do you want to complete the project? Create a schedule with milestones that you want to achieve.  ',
           'hinweis': '',
           'tipp':''
            },
            {'id':'Work packages derived and divided', 
           'info': 'Derive work packages and divide them among your staff.',
           'hinweis': '',
           'tipp':''
            },
            {'id':'Coordination and responsibilities clarified', 
           'info': 'One person must take responsibility and coordinate, drive, and ensure that the project schedule adheres.  ',
           'hinweis': '',
           'tipp':''
            },
            {'id':'Employees educated and commitment obtained', 
           'info': 'Often this point is essential because of interests within the company overlap. If employees do not understand your project, it will most likely fail. Especially in production, where a high number of units and, thus, low downtime plays the overriding role. Here, adjustments or solutions to problems during downtime are not always documented due to time constraints. Try to identify and integrate "project opponents" and ensure their willingness to support the project. A workshop, for example, can promote acceptance among employees. ',
           'hinweis': '',
           'tipp':''
            },
            {'id':'Specifications created', 
           'info': 'Create a specification sheet. What are the requirements to be met? What statements should be made based on the recorded data (e.g., system condition, damage detection, etc.)? ',
           'hinweis': '',
           'tipp':''
            },
  //3
  {'id':'Measurement and data planning', 
    'info': 'After the initial preparations are completed, the measurement and data planning can begin. First, it is essential to record or build up basic process knowledge and identify existing norms or standards. Your data is usually not only used within one department, so a uniform and understandable data structure with all necessary metadata is essential. ',
    'hinweis': 'Measurement and data planning is an iterative process and may (or must, if necessary) be adjusted. ',
    'tipp':'Make sure that knowledge/information is always available in your project! Use existing structures and procedures in your company for data storage and documentation. If you need to set up a new structure, follow the FAIR data principles; see https://www.fairsharing.org/. FAIR stands for Findable, Accessible, Interoperable, and Reusable. Note that "FAIR" data is not the same as "open" data. Findability or accessibility can also be exclusive to your company or individual departments. '
  },
            {'id':'Build up and use process knowledge',  //3.1
            'info': '',
            'hinweis': '',
            'tipp':''
             },
                  {'id':'Already existing features identified', 
                  'info': 'Which features are already recorded in your plant or process, and for whom (which department) are they relevant? E.g., Which characteristics are interesting for the assembly, quality, or automation department? ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Quality requirements identified', 
                  'info': 'Talk to your quality assurance and/or your customers and document important measurement/test variables. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Cause-effect diagram created', 
                  'info': 'Create a cause-effect diagram, also called an Ishikawa diagram. This will help you to identify the causes of problems or influencing factors. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Interference variables identified and their influence determined', 
                  'info': 'To obtain a robust machine learning model, determining interfering variables and considering their range of values or influence is enormously significant, as the learning models are usually unable to extrapolate. Interference variables can be, for example, temperature, humidity, manufacturer tolerances, and also employees (at manual workplaces). The cause-effect diagram and the process expert can support you in determining the interference variables. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Influence of interference variables minimized', 
                  'info': 'According to the point "Interference variables identified and their influence determined" minimizing the influence of interference variables makes sense. Check to what extent this is possible in your project. For example, limiting to a single product type variant helps eliminating product-specific influences. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'The use of additional sensors considered', 
                  'info': 'If, for example, you have identified relevant variables or characteristic values based on your cause-effect diagram or, according to your process experts recommendation, consider installing additional sensors. Additional sensors do not necessarily have to be physical; virtual sensors can also be used to calculate values from measured variables.   ',
                  'hinweis': '',
                  'tipp':'If you decide to use additional sensor technology and are unsure which sensors you need, try more accurate or higher-quality sensors first. Many sensor manufacturers will also help you select sensors and provide them for test measurements. Alternatively, some companies also offer sensors for rent. '
                   },
                   {'id':'Overview of sensors created', 
                  'info': 'Create an overview of the sensors used with all relevant information. You can use the following points as a guide ',
                  'hinweis': '',
                  'tipp':''
                   },
            {'id':'Use norms and standards', //3.1.1
            'info': '',
            'hinweis': '',
            'tipp':''
             },
                  {'id':'Internal standards researched', 
                  'info': 'Many companies have already developed their internal standards and guidelines for data recording. You should check these first and use them if they are suitable. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'External standards and norms researched', 
                  'info': 'Check whether there are already established standards or norms for data recording in your sector or the industry in general. ',
                  'hinweis': 'If norms or standards already exist for your field, it is strongly recommended to use them or build on them. For example, the International Organization for Standardization (ISO) and the European Committee for Standardization (CEN or CENELEC) should be considered.  For the automotive industry, the Association of Standardization of Automation and Measuring Systems (ASAM) offers standards in various disciplines, such as measuring systems, data management, simulation, and many others.',
                  'tipp':''
                   },
            {'id':'Structure of the data', //3.2
            'info': '',
            'hinweis': '',
            'tipp':''
             },
                  {'id':'Data format selected', 
                  'info': 'Consult with your process and data analysis experts and select a suitable file format uniformly. Ideally, the file format should be non-proprietary and already established. It should also be as easy as possible to add metadata.  ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Data structure selected', 
                  'info': 'Consider how to structure your data in a meaningful way. Neither countless small files nor one large file with all the data is recommended here. Consider the compatibility of the data structure with already existing/used databases within your company.',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Unique naming of the data selected', 
                  'info': 'By naming your data clearly and uniquely, you increase the manageability of your data immensely. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Descriptive naming of the data selected', 
                  'info': 'By giving your data a descriptive name (e.g., Date_Time_Product_Station_Sensor), you also increase the manageability of your data. The possible level of detail for a descriptive naming depends strongly on the complexity of your system and your project because too long file names can lead to problems in the analysis. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Automatic annotation of the data ensured', 
                  'info': 'Manual or subsequent labeling poses a potential risk of incorrect metadata, especially with high volumes. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'A clear relationship between the data to the individual products established', 
                  'info': 'To enable later evaluation across stations, it is necessary to assign the data to the assembled products, e.g., via the serial number (unique ID).  ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Metadata to be recorded selected', 
                  'info': 'Select relevant metadata, such as machine and sensor configurations. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Comprehensible description of the metadata selected', 
                  'info': 'Each measurement must be described clearly, thoroughly, and understandably. With the help of the metadata or documentation, a project outsider should be able to answer the W-questions (Who?, What?, How?, Where?, When?, and Why?). ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Format of time stamps defined and documented', 
                  'info': 'Separator (point or comma) , Format , Specify the date and time together or separately.   ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Reference systems adapted and documented', 
                  'info': 'Adapt zero points, references, and coordinate systems to each other and document it in the metadata.',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Label reference runs and test measurements', 
                  'info': 'If the data you are recording includes reference runs, test measurements, reference patterns, or similar measurements that deviate from the regular operation, clearly label them as such or save them separately. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Storage of threshold values', 
                  'info': 'Save the threshold values of individual processes in the metadata as well. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Clear definition of measured values and critical figures provided', 
                  'info': 'Especially in the case of key figures, different formulas are often used for calculation (e.g., Overall Equipment Effectiveness - OEE). Define and document the formulas used. ',
                  'hinweis': '',
                  'tipp':''
                   },
                   {'id':'Non-digital knowledge or data digitized', 
                  'info': 'Often helpful information can be found in non-digital knowledge and data, e.g., shift books, maintenance books, etc. Document this information by digitizing it. In the simplest case, by a photo or scan and save it with the (meta-)data.  ',
                  'hinweis': '',
                  'tipp':'A uniform structure and a suitable data format make the data more accessible and easier to process. Some "best practices" for data formats have developed from various experiences. For example, for larger amounts of data, a binary format such as HDF5 [2] or similar (TDMS for NI LabVIEW [3]) is suitable for larger amounts of data because of its simple structuring and use. On the other hand, formats that are open (non-proprietary) and more readable for humans are more suitable for smaller amounts of data. These include, for example, the CSV format [4], which is particularly useful for manually entered data. The JSON format [5] is suitable as a human- and machine-readable exchange format for automated systems (e.g., databases). '
                   },
                   {'id':'Structure of the data', 
                  'info': '',
                  'hinweis': '',
                  'tipp':''
                   },
            {'id':'Data storage', //3.3
            'info': '',
            'hinweis': '',
            'tipp':''
             },
                   {'id':'Existing data collection systems integrated', 
                   'info': 'Try to integrate the captured data of existing data capture systems into your data repository as well. ',
                   'hinweis': 'Experience shows that the interfaces from the sensor to the server are not implemented as quickly as desired/thought. Plan additional time here if necessary. ',
                   'tipp':''
                    },
                    {'id':'Storage requirements estimated',
                    'info': 'Estimate the required storage and calculate a safety margin. ',
                    'hinweis': '',
                    'tipp':''
                     },
                     {'id':'Suitable platform for data storage selected', 
                    'info': 'Select a suitable platform for data storage, considering company policies and anticipated storage space requirements, if applicable. Examples would be Hard drives, servers, or a cloud. ',
                    'hinweis': '',
                    'tipp':''
                     },
                     {'id':'Data back-up selected', 
                    'info': 'To prevent data loss, you should store your data with a suitable strategy (e.g., the 3-2-1 back-up rule in combination with RAID systems) ',
                    'hinweis': '',
                    'tipp':''
                     },
            {'id':'Integrate manually collected data', //3.4
            'info': '',
            'hinweis': 'Manually collected data often contain relevant information for interpreting occurrences in data and are, therefore, crucial for analysis. ',
            'tipp':'Using standards and drop-down lists enables the machine readability of manually entered data. '
             },
                     {'id':'Human influence reduced', 
                    'info': 'Reduce human influence as much as possible',
                    'hinweis': '',
                    'tipp':''
                     },
                     {'id':'Digital shift books introduced', 
                     'info': 'The introduction of digital shift books greatly increases the accessibility of the information they contain [7]. Especially in case of discrepancies in the data, the shift book can provide valuable information. ',
                     'hinweis': '',
                     'tipp':''
                      },
                      {'id':'Documentation of all state changes ensured', 
                      'info': 'All types of interventions, changes, and adaptations to plants, processes, and equipment must be documented. ',
                      'hinweis': '',
                      'tipp':''
                       },
                       {'id':'Comment section implemented if required', 
                       'info': 'Especially in the case of unforeseeable complications, a section for additional text, although not directly machine-readable, can be helpful for the error description. ',
                       'hinweis': '',
                       'tipp':''
                        },
                        {'id':'Images integrated as an additional data source', 
                        'info': 'Pictures, especially in the case of mechanical defects, can also be helpful for your analyses. ',
                        'hinweis': '',
                        'tipp':''
                         },
                         {'id':'Allows mapping of manual data to automated data', 
                        'info': 'Enable the assignment of manual data to automated data, e.g., via time stamp, product ID, or similar. Note that metadata also plays an important role here. ',
                        'hinweis': '',
                        'tipp':''
                         },
//4
{'id':'Data acquisition', 
           'info': 'After the measurement and data planning has been done, the first data can be recorded. A sharp separation between measurement and data planning, and data recording is not possible, as one will typically have to make adjustments after evaluating the first data.  ',
           'hinweis': '',
           'tipp':''
  },
          {'id':'First test measurement and data quality check', //4.1
                   'info': '',
                   'hinweis': '',
                   'tipp':''
          },
                  {'id':'Test measurements carried out',
                  'info': 'Carry out a first test measurement under real conditions. The measurement should not be too extensive but still contain several measurements from all sensors. ',
                  'hinweis': '',
                  'tipp':'It makes sense to record time-continuous data at the beginning or later at regular intervals ("curve data"). E.g., after a number X of produced parts, time-continuous data are recorded of Y produced parts.  '
                  },
                  {'id':'Data structure checked',
                  'info': 'Check that the data has been stored in the desired structure (measured values and metadata). Forward the recorded data to the data analysts and ensure the data structure is understandable, complete, and workable. ',
                  'hinweis': '',
                  'tipp':''
                  },
                  {'id':'Proper function of the sensors checked',
                  'info': 'Check, ideally with the process experts, whether the sensors are functioning correctly and delivering plausible values. For example, you can plot the corresponding data points and check the measurement. Suppose sensors do not record any or unexpectedly constant measured values (e.g., 0). In that case, this may indicate an error in data acquisition. Also, check whether you can detect quantization steps in your measurement signals and, if necessary, replace the sensor with a sensor with a higher resolution or better analog-to-digital converter (ADC). ',
                  'hinweis': '',
                  'tipp':''
                  },
                  {'id':'Synchronization of the data acquisition systems ensured',
                  'info': 'Check that your data acquisition systems run sufficiently synchronized with each other. A maximum deviation of 10% of the cycle time is a reasonable basis for assembly processes. This step is essential for sensor fusion. ',
                  'hinweis': '',
                  'tipp':''
                  },
                  {'id':'Assignment of data to processes and products ensured',
                  'info': 'Ensure that your data can be clearly assigned to the corresponding products and processes (e.g., via the product ID). Only then an analysis of multiple plants is possible.',
                  'hinweis': '',
                  'tipp':''
                  },
                  {'id':'Data quality evaluated',
                  'info': 'Try to evaluate the quality of your data (and increase it if necessary)',
                  'hinweis': '',
                  'tipp':''
                  },
            {'id':'Long-term data recording', //4.2
            'info': '',
            'hinweis': '',
            'tipp':''
                  },
                  {'id':'Inspection intervals set',
                  'info': 'Set regular intervals for checking data quality. In the beginning, this should be more frequent to be able to intervene early in case of malfunction. ',
                  'hinweis': '',
                  'tipp':''
                  },
                  {'id':'Proper function of the sensors checked',
                  'info': 'Check that all sensors are still working correctly and providing plausible values. ',
                  'hinweis': '',
                  'tipp':''
                  },
                  {'id':'Statistical significance tested',
                  'info': 'Unfortunately, there is no valid answer to the question, "How much data do I need for machine learning?". In principle, it is not the specific number of recorded measurements that matters but rather that the data represent the spectrum of regularly occurring disturbance variables (such as temperature fluctuations, manufacturer tolerances, etc.). Therefore, check the statistical significance of your disturbance variables, e.g., with hypothesis tests [9]. ',
                  'hinweis': '',
                  'tipp':''
                  },
                  {'id':'First data analysis carried out',
                  'info': 'Carry out an initial data analysis (cf. chapter Data evaluation and modeling) to identify relevant sensors or features early and interpret their behavior. Remember that unfavorably sensor types or mounting positions might have been selected.  ',
                  'hinweis': '',
                  'tipp':''
                  },
  {'id':'Data check and data cleansing',//5
  'info': 'Even with optimal planning and the best possible execution of your measurements, mistakes and errors will happen. Therefore, you need to check and clean the data after recording. These errors do not necessarily have to be human but can also come from your data acquisition system. This is a normal process, especially in iterative approaches, and should not unsettle you. ',
  'hinweis': '',
  'tipp':''
  },
          {'id':'Data structure checked again',
          'info': 'Check whether the recorded data still is in the desired structure and correct any deviations.  ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'Missing information added',
          'info': 'If necessary, add missing information, such as target values or metadata. ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'Data combined',
          'info': 'Suppose you have several individual data records, e.g., from several stations. In that case, you can combine them by using the product ID or the time stamp. ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'Blind spots identified',
          'info': 'Areas where data is not (cannot) be recorded are called blind spots. The gaps in the data caused by blind spots should be filled, if possible, by empirical knowledge and physical correlations. ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'Data cleansed of invalid measurements',
          'info': 'Remove measurements from your dataset where the measured value (unintentionally) has always taken the same value or zero. ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'References and zero points adjusted',
          'info': 'If you use different references or zero points for measurement data or time stamps, merge them to ensure the same reference system. ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'Reference runs and test measurements separated',
          'info': 'If the data you recorded also contains reference runs, test measurements, or similar measurements that deviate from the regular operation, sort them out. You should not simply delete them, as information about the condition of your system can be obtained over time. ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'Outliers removed from the evaluation',
          'info': 'Outliers are measured values that deviate recognizably and justifiably from the rest of the measured values and their variance [10]. Remove outliers from your evaluation if they are not physically plausible or significantly influence the distribution of your data. ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'Units checked and unified',
          'info': 'Incomplete, missing, or wrong units are a considerable risk in data analysis. In the example of length measurement, it makes a big difference whether you measure in meters or inches. Convert all measured values of a measurand into the selected standard unit. ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'Distribution shift balanced',
          'info': 'Check whether your data distribution is drifting and, if necessary, compensate for this drift if it is not the desired information. ',
          'hinweis': '',
          'tipp':''
          },
          {'id':'Data cleansing documented',
          'info': 'Document the steps taken, with additional comments if necessary.',
          'hinweis': '',
          'tipp':''
          },
  {'id':'Data evaluation and modeling',//6
  'info': 'Machine learning cannot and should not be seen as omnipotent regarding data interpretation. Instead, it should be seen as a compass that guides you toward the right path to interpret your data. Before you build a machine learning model, you should first build a basic understanding of the data. ',
  'hinweis': '',
  'tipp':''
  },
          {'id':'Data understanding',//6.1
          'info': '',
          'hinweis': '',
          'tipp':''
          },
                {'id':'Suitable time scale selected for visualization',
                'info': 'Use a suitable time scale for the visualization of your data. For example, the ambient temperature in production halls rarely changes abruptly within a few minutes; drifts occur over the day or the week. Reasonable observation periods could be, for example, by shift, day, or week. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Signal curves plotted in the time series diagram',
                'info': 'Take a look at the signal curves of your measurements. Do not focus exclusively on one signal here but plot several measurements (of the same or different sensors) in a diagram. Try to get a feeling for your data this way. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Quasi-static signals plotted',
                'info': 'The quasi-static signal can also provide information about your process, e.g., it can help you identify drift effects. In the context of this article, a quasi-static signal is a signal created by stringing together a selected data point in a measurement over a series of measurements. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Histograms plotted',
                'info': 'Histograms also provide valuable insights into your data. It is often easier to identify outliers by displaying the histogram of a process. For example, process-specific or supplier changes can also be recognized in the histogram. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Boxplot diagram plotted',
                'info': 'By clearly displaying several positions and dispersion measurements of a process in a single box, it is easy to compare identical processes [11].',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Principal component analysis performed',
                'info': 'A Principal Component Analysis (PCA) in combination with significant target variables can be used to identify the biggest influences on the data. By coloring according to the target variable (or disturbance variables such as ambient temperature, layers, or batches), clusters can be identified. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Error patterns examined and interpreted',
                'info': 'Investigate and interpret error patterns in individual systems or stations and their effect on the overall system.  ',
                'hinweis': 'Only compare like with like. When comparing with two or more diagrams: Label axes correctly, scale them the same, and use the same units. ',
                'tipp':''
                },
          {'id':'Selection of machine learning algorithms', //6.2
          'info': '',
          'hinweis': '',
          'tipp':''
          },
                {'id':'State-of-the-art reviewed',
                'info': 'Research the current state of the art by searching the web or literature, attending training courses or specialist conferences, if necessary. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Available computing power checked',
                'info': 'A criterion that should not be underestimated when selecting machine learning algorithms and especially when optimizing their parameters is the necessary computing power. The lower your available computing power, the longer your calculation will take and the longer your system will be blocked if you do not switch to resource-saving algorithms. ',
                'hinweis': 'Depending on the selected algorithm and scope of the data, training a machine learning model, including validation, can quickly go from several hours over several days to several weeks. You should take this into account and test simple models or algorithms first. ',
                'tipp':''
                },
                {'id':'Learning problem defined',
                'info': 'In principle, a distinction is made in the industrial context between classification problems (e.g., damaged/undamaged or damage A/B/C) and regression problems (e.g., service life 0-100%) as well as anomaly detection, i.e., detection of new states caused by changed boundary conditions or disturbance variables. Depending on the selected learning problem, different algorithms are relevant. ',
                'hinweis': 'Given the large number of existing machine learning algorithms, no algorithm can be applied universally per se and is equally well suited to all learning problems.  Be aware that you will undergo an iterative process with a changing combination of different algorithms. ',
                'tipp':'If you have little or no experience with machine learning, consider outsourcing the data analysis. This does not necessarily have to be a company. You can also approach research institutes or universities for research projects (as an active or associated partner). You will often find motivated researchers with expertise but limited access to "real-world data". In this way, both industry and research can benefit. '
                },
                {'id':'Suitable and realistic validation scenario selected',
                'info': 'Perhaps the most important and often underestimated point in machine learning is selecting a suitable validation scenario. Creating a machine learning model that classifies your data with 100% accuracy (classification problem) or predicts the desired target variable (regression problem) is easy in principle. However, this model is most likely unreliable and suffers from overfitting, i.e., in the simplest case, it learns the test data patterns by heart. By consciously dividing your data into training, validation, and test data, you can check how well your model performs on the "unknown" data. (Group-based) cross-validation is an established method to avoid overfitting. Suppose you also vary the free parameters of the ML model (so-called hyperparameters). In that case, you need additional test data which are not included in the modeling to check for overfitting with the hyperparameters. Be sure to test the actual transferability of your algorithm with one (or more) realistic validation scenarios. This is the only way to assess your models robustness against disturbance variables. ',
                'hinweis': '',
                'tipp':'A good introduction to the validation of machine learning algorithms is provided by Maleki et al. in their review paper "Machine Learning Algorithm Validation - From Essentials to Advanced Applications and Implications for Regulatory Certification and Deployment" [12]. '
                },
                {'id':'Feature extraction algorithms selected',
                'info': 'Often the individual measurement points of measurement (raw data) are of little significance, so it is essential to extract relevant features from them. These can be, for example, mean values and slopes over defined intervals (linear fit), frequencies from the frequency spectrum, or statistical values (standard deviation, kurtosis). Feature extraction usually reduces the dimensionality of the data considerably, which on the one hand, simplifies the calculation of suitable models and, on the other hand, reduces the tendency to overfitting. ',
                'hinweis': '',
                'tipp':'The free ML toolbox DAV³E (Data Analysis and Verification/Visualization/Validation Environment) with a graphical user interface developed at the Lab for Measurement Technology can support you in analyzing your data [13]. The toolbox combines selected algorithms for feature extraction, feature selection, and classification or regression.  DAV³E can be downloaded from https://github.com/lmtUds/dav3e-beta.  A script-based version of the toolbox can be found at: https://github.com/ZeMA-gGmbH/LMT-ML-Toolbox. '
                },
                {'id':'Feature selection algorithms selected',
                'info': 'Especially in complex systems with a high number of sensors, a high number of features can result. To save resources (computing power and time) and to prevent overfitting, the number of features can be reduced by selecting the most relevant ones. This can also be done by simple algorithms such as correlation analysis or more complex algorithms (or a combination of both). ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Algorithms for classification or regression selected',
                'info': 'Select algorithms for classification or regression according to your learning problem. First, use simple approaches, e.g., for classification, a Linear Discriminant Analysis (LDA) in combination with a k-nearest neighbor classifier or, for regression, a Partial Least Squares Regression (PLSR). These approaches not only have low demands on computing power but can also be well visualized so that one gets a first impression of the model quality. Higher-level methods, such as artificial neural networks, are often black-box methods with results that can hardly be interpreted. An overview of the most common algorithms can be found in [14]. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Additional anomaly detection applied',
                'info': 'Due to the often-high amount of "good" data and few "bad" data in production, it is worthwhile to implement an additional anomaly detection. This detects when the distribution of your process or station changes above a previously defined level and then issues a message/alert. Should this shift occur due to an error, the corresponding measurements can be annotated and fed into a machine-learning model. ',
                'hinweis': 'Artificial neural networks and machine learning are linked in the public mind and are associated with each other. If you are considering using neural networks in an industrial context, be aware of the following points: ',
                'tipp':''
                },
          {'id':'Modeling', //6.3
          'info': '',
          'hinweis': '',
          'tipp':''
          },
                {'id':'Performance of the machine learning algorithms compared',
                'info': 'Compare the performance of your chosen algorithms in the different validation scenarios. For classification, this is primarily the percentage of correctly classified validation or test data, and for regression, the mean square error for validation or test data. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Suitable learning algorithms selected',
                'info': 'Select suitable algorithms based on the performance. The algorithms do not have to be the same for all sensors and can also differ from sensor to sensor.',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Model uploaded for application',
                'info': 'Once your model has been trained, you can upload it to the intended application location (this does not have to be on the station but can also be on a server or the cloud) for use.',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Model controlled',
                'info': 'After a reasonable time, use the additional data from production to check whether your machine learning model continues to deliver the desired and, above all, plausible results. If this is not the case, you may need to record more data containing the cross-influence of the disturbance variable (which led to the error) or revise your ML model. ',
                'hinweis': '',
                'tipp':''
                },
          {'id':'Model application',
          'info': '',
          'hinweis': '',
          'tipp':''
          },
                {'id':'Regular validation of the model scheduled',
                'info': 'You should regularly check whether your model still provides meaningful and plausible data. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Regular re-training of the model scheduled',
                'info': 'You should re-train your model at regular intervals. This way, you can also include newer data in your model, compensate for drift effects, and at best, increase the robustness of your model. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Hardware and software changes documented',
                'info': 'Document any changes to the state of your process or system. Consider version control (e.g., via GitLab) of your software and machine learning model to be able to view previous models. Be aware that if the hardware is changed significantly, the ML model may need to be fundamentally re-trained, as the data patterns and distribution before and after the modification may no longer match. ',
                'hinweis': '',
                'tipp':''
                },
  {'id':'Project completion', //7
  'info': 'In contrast to the application and regular optimization of your machine learning model, your project must be completed at a specific time. To benefit in future machine learning projects from your accumulated experience of this project, it is essential to provide your approach, findings, and all documentation clearly and thoroughly. ',
  'hinweis': '',
  'tipp':''
                },
                {'id':'Analysis results compared with the initial objective of the analysis',
                'info': 'Compare your initial objective with the actual analysis results and document the deviations.  ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Lessons learned formulated',
                'info': 'In every project, mistakes or things that could have been solved better inevitably happen. So not only do you learn from the project, but you should also formulate your lessons learned for future employees and projects.  ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Final presentation created',
                'info': 'Create a short final presentation in which you clearly state your project objectives, approach, achievements, and limitations. This will enable your colleagues to grasp your project and build on it quickly. ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'Final report drafted',
                'info': 'Write a final report; it should be as comprehensive as necessary but at the same time as short as possible.  ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'All documents centrally stored',
                'info': 'Check whether all necessary documents, programs, and, if applicable, data have been stored centrally and can be easily found.  ',
                'hinweis': '',
                'tipp':''
                },
                {'id':'',
                'info': '',
                'hinweis': '',
                'tipp':''
                },





  //3
  {'id':'Datenaufnahme', 
           'info': 'Nachdem die Mess- und Datenplanung erfolgt ist, können erste Daten aufgenommen werden. Eine scharfe Trennung zwischen Mess- und Datenplanung und Datenaufnahme ist nicht möglich, da Sie im Normalfall, nachdem Sie erste Daten aufgezeichnet haben, weitere Anpassungen vornehmen müssen.',
           'hinweis': '',
           'tipp':''
  }
]