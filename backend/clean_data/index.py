import os
from time import time
import pandas as pd
import numpy as np
import regex as re
import warnings

warnings.filterwarnings('ignore')

def get_single_keywords(df: pd.DataFrame):
    COL_KEY_NAME = str(df.iloc[:, 0].name)
    COL_CODE_NAME = str(df.iloc[:, 1].name)
    # get keyword not contain '+'
    df_tempr = df[~df[COL_KEY_NAME].str.contains('+', regex=False, na=False)]
    # sort values by word length
    index_sorted = df_tempr[COL_KEY_NAME].str.len(
    ).sort_values(ascending=False).index
    # sord df by new above index
    df_sorted = df.reindex(index_sorted)
    df_sorted = df_sorted.reset_index(drop=True)
    df_sorted[COL_KEY_NAME] = df_sorted[COL_KEY_NAME].map(
        lambda x:  re.escape(x.replace('#&', '').strip()))
    df_sorted = df_sorted.groupby([COL_CODE_NAME], as_index=False).agg({
        COL_KEY_NAME: '|'.join})
    df_sorted = pd.DataFrame(df_sorted)
    df_sorted[COL_KEY_NAME] = df_sorted[COL_KEY_NAME].map(
        lambda x: r'\b(' + x + r')\b')
    # Map to dict keys = keywords, values = code
    dict1 = dict(zip(df_sorted[COL_CODE_NAME].values, df_sorted[COL_KEY_NAME]))
    return dict1


def get_combination_keywords(df: pd.DataFrame):
    COL_KEY_NAME = str(df.iloc[:, 0].name)
    COL_CODE_NAME = str(df.iloc[:, 1].name)
    # get keyword not contain '+'
    df_tempr = df[df[COL_KEY_NAME].str.contains('+', regex=False, na=False)]
    # get count char '+' in string
    series_count = df_tempr[COL_KEY_NAME].apply(lambda x: x.count('+'))
    index_sorted = series_count.sort_values(ascending=False).index
    df_sorted = df_tempr.reindex(index_sorted)
    df_sorted = df_sorted.reset_index(drop=True)

    df_sorted = df_sorted.groupby([COL_CODE_NAME], as_index=False).agg({
        COL_KEY_NAME: '|'.join})
    df_sorted = pd.DataFrame(df_sorted)
    # Map to dict keys = keywords, values = code
    keyword_keys = ['|'.join([''.join([r'(?=.*\b' + re.escape(x.replace('#&', '').strip()) + r'\b)' for x in keyword.split('+')])+'.*' for keyword in string.split('|')]) 
    for string in list(df_sorted[COL_KEY_NAME])]
    dict1 = dict(zip(df_sorted[COL_CODE_NAME].values, keyword_keys))
    return dict1

def final_keyword(single_dict: dict, combination_dict: dict):
    list_keys = list()
    for k, v in combination_dict.items():
        if k in single_dict.keys():
            single_dict[k] =  v + '|' + combination_dict[k]
            list_keys.append(k)
    for k in list_keys:
        del combination_dict[k]
    final_dict = dict(single_dict, **combination_dict)
    return final_dict

def clean_data(data_src: str, keyword_src: str):
    data_df = pd.read_excel(data_src)
    data_df.dropna()
    DATA_COL_NAME = data_df.iloc[:,0].name
    data_df['CODE'] = np.nan
    keyword_df = pd.read_excel(keyword_src)
    COL_KEY_NAME = str(keyword_df.iloc[:, 0].name)
    COL_CODE_NAME = str(keyword_df.iloc[:, 1].name)
    keyword_df = keyword_df.drop_duplicates(subset=[COL_KEY_NAME, COL_CODE_NAME]).reset_index(drop=True)
    single_dict = get_single_keywords(df=keyword_df)
    combination_dict = get_combination_keywords(df=keyword_df)
    final_dict = final_keyword(single_dict=single_dict, combination_dict=combination_dict)
    df_tempr = pd.DataFrame(columns=data_df.columns)

    errors = list()
    # mảng
    for k, v in final_dict.items():
        try:
            data_df.loc[data_df[DATA_COL_NAME].str.contains(v, regex= True, na=False, flags=re.IGNORECASE), 'CODE'] = k
        except:
            
            break
        finally:
            df_tempr = pd.concat([df_tempr, data_df[~data_df['CODE'].isnull()]])
            data_df = data_df[data_df['CODE'].isnull()]


    df_tempr = pd.concat([df_tempr, data_df])
    ts = time()
    base=os.path.basename(data_src)
    file_name = os.path.splitext(base)[0] + str(ts) + '.xlsx'
    output_src = f"./result_file/" + file_name
    df_tempr.sort_index().to_excel(output_src, index=False)
    
    return output_src
