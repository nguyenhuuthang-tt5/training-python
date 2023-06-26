import pandas as pd
import numpy as np
import regex as rg

RESULT_DF = pd.DataFrame()

ROOT_DF = pd.read_excel('./resources/root_data.xlsx')

KEYWORD_DF = pd.read_excel('./resources/keyword.xlsx', sheet_name='BE - TYPE OF OIL', skiprows=1, usecols=[1, 2])

DESCRIPTION_VN_DF = ROOT_DF['DESCRIPTION_VN'].str.lower()

def handleFilter(data: str, filter: dict):
    for k, v in filter: 
        
        
